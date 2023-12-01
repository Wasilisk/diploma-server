import { BadRequestException, Injectable } from '@nestjs/common';
import { constants } from '../common/utils/constants';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { TicketType } from '@prisma/client';

@Injectable()
export class PaymentService {
  private stripe;

  constructor(private prismaService: PrismaService) {
    this.stripe = new Stripe(constants.stripeApiKey!, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(createCheckoutSession: CreateCheckoutSessionDto) {
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

      const normalizedTours = tours
        .filter((tour) => toursIds.includes(tour.id))
        .reduce<Record<string, any>>((acc, tour) => {
          return { ...acc, [tour.id]: tour };
        }, {});

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
                description: ticketType.name,
              },
              unit_amount: ticketType.price * 100,
            },
            quantity: item.count,
          };
        }),
        success_url: `${constants.clientUrl}/success-payment`,
        cancel_url: `${constants.clientUrl}/`,
      });
      return { url: session.url };
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
