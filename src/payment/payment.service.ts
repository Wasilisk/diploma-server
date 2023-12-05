import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { constants } from '../common/utils/constants';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { TicketType } from '@prisma/client';
import { normalizeArray } from '../common/utils/normalize-array';
import { OrderService } from '../order/order.service';
import { CreateOrderDto } from '../order/dto/create-order.dto';

@Injectable()
export class PaymentService {
  private stripe;

  constructor(
    private prismaService: PrismaService,
    private orderService: OrderService,
  ) {
    this.stripe = new Stripe(constants.stripeApiKey!, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(
    createCheckoutSession: CreateCheckoutSessionDto,
    userId: number,
  ) {
    try {
      const toursIds = createCheckoutSession.orders.map(
        (order) => order.tourId,
      );
      const tours = await this.prismaService.tour.findMany({
        where: {
          id: { in: toursIds },
        },
        include: {
          ticketTypes: true,
        },
      });

      const normalizedTours = normalizeArray(
        tours.filter((tour) => toursIds.includes(tour.id)),
        'id',
      );

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: createCheckoutSession.orders.map((item) => {
          const ticketType = normalizedTours[item.tourId].ticketTypes.find(
            (ticketType: TicketType) => ticketType.id === item.ticketTypeId,
          );
          return {
            price_data: {
              currency: 'UAH',
              product_data: {
                name: normalizedTours[item.tourId].name,
                description: ticketType?.name,
              },
              unit_amount: ticketType?.price! * 20,
            },
            quantity: item.count,
          };
        }),
        payment_intent_data: {
          metadata: {
            orders: JSON.stringify(createCheckoutSession.orders),
            userId: userId,
          },
        },
        success_url: `${constants.clientUrl}/success-payment`,
        cancel_url: `${constants.clientUrl}/`,
      });
      return { url: session.url };
    } catch (e) {
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
        const paymentIntentSucceeded = event.data
          .object as Stripe.PaymentIntent;
        const orders = JSON.parse(
          paymentIntentSucceeded.metadata.orders,
        ) as CreateOrderDto[];

        await this.orderService.createOrders(
          orders,
          Number(paymentIntentSucceeded.metadata.userId),
        );

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return HttpStatus.OK;
  }
}
