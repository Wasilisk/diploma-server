import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { constants } from '../common/utils/constants';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import Stripe from 'stripe';
import { TicketType } from '@prisma/client';
import { OrderService } from '../order/order.service';
import { TourService } from '../tour/tour.service';
import { TourGroupService } from '../tour-group/tour-group.service';
import { addMinutes, getTime } from 'date-fns';

@Injectable()
export class PaymentService {
  private stripe;

  constructor(
    private tourGroupService: TourGroupService,
    private orderService: OrderService,
    private tourService: TourService,
  ) {
    this.stripe = new Stripe(constants.stripeApiKey!, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(
    { orders, ...orderTourInfo }: CreateCheckoutSessionDto,
    userId: number,
  ) {
    let reservedOrdersIds: number[] = [];
    try {
      const tour = await this.tourService.getById(orderTourInfo.tourId);

      if (!tour || !tour.tourInfo) {
        return new BadRequestException();
      }

      const totalOrdersCount = orders.reduce(
        (total, order) => total + order.count,
        0,
      );

      const tourGroup =
        await this.tourGroupService.getByTourDateTime(orderTourInfo);

      if (!tourGroup) {
        const newTourGroup = await this.tourGroupService.create(orderTourInfo);
        const reservedOrders = await this.orderService.reserveOrders(
          orders.map((order) => ({
            ...order,
            tourId: orderTourInfo.tourId,
            tourGroupId: newTourGroup.id,
          })),
          userId,
        );

        reservedOrdersIds = reservedOrders.map((order) => order.id);
      } else {
        const remainingCountOfPlacesInTheGroup =
          tour.tourInfo.groupSize -
          tourGroup.orders.reduce((total, order) => total + order.count, 0);

        if (totalOrdersCount > remainingCountOfPlacesInTheGroup) {
          throw new BadRequestException('Not enough places');
        }

        const reservedOrders = await this.orderService.reserveOrders(
          orders.map((order) => ({
            ...order,
            tourId: orderTourInfo.tourId,
            tourGroupId: tourGroup.id,
          })),
          userId,
        );
        reservedOrdersIds = reservedOrders.map((order) => order.id);
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        expires_at: Math.floor(getTime(addMinutes(new Date(), 45)) / 1000),
        line_items: orders.map((item) => {
          const ticketType = tour.ticketTypes.find(
            (ticketType: TicketType) => ticketType.id === item.ticketTypeId,
          );

          if (!ticketType) return {};
          return {
            price_data: {
              currency: 'UAH',
              product_data: {
                name: ticketType.name,
              },
              unit_amount: ticketType.price * 10,
            },
            quantity: item.count,
          };
        }),
        payment_intent_data: {
          metadata: {
            reservedOrdersIds: JSON.stringify(reservedOrdersIds),
            userId: userId,
          },
        },
        success_url: `${constants.clientUrl}/success-payment`,
        cancel_url: `${constants.clientUrl}/`,
      });
      return { url: session.url };
    } catch (e) {
      await this.orderService.deleteOrdersByIds(reservedOrdersIds);
      throw new BadRequestException();
    }
  }

  async webhook(body: Buffer, headers: Record<string, string>) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        headers['stripe-signature'],
        constants.stripeWebhookSecret!,
      );
    } catch (err) {
      return HttpStatus.BAD_REQUEST;
    }
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSuccess = event.data.object as Stripe.PaymentIntent;
        const reservedOrdersIds = JSON.parse(
          paymentIntentSuccess.metadata.reservedOrdersIds,
        ) as number[];

        await this.orderService.setActiveOrderStatus(reservedOrdersIds);

        break;
      case 'payment_intent.payment_failed':
      case 'checkout.session.async_payment_failed':
        const paymentIntentPaymentFailed = event.data
          .object as Stripe.PaymentIntent;
        const ordersIdsToDelete = JSON.parse(
          paymentIntentPaymentFailed.metadata.reservedOrdersIds,
        ) as number[];

        await this.orderService.deleteOrdersByIds(ordersIdsToDelete);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return HttpStatus.OK;
  }
}
