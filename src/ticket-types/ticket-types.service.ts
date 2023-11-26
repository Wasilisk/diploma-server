import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getImageUrl } from '../common/utils/get-image-url';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';

@Injectable()
export class TicketTypesService {
  constructor(private prisma: PrismaService) {}

  async create(ticketTypeDto: CreateTicketTypeDto) {
    const ticketType = await this.prisma.ticketType.create({
      data: {
        tour: {
          connect: {
            id: Number(ticketTypeDto.tourId),
          },
        },
        name: ticketTypeDto.name,
        price: Number(ticketTypeDto.price),
      },
    });

    return ticketType;
  }

  async getByTourId(tourId: number) {
    const ticketTypes = await this.prisma.ticketType.findMany({
      where: {
        tourId,
      },
    });

    return ticketTypes;
  }

  async delete(ticketTypeId: number) {
    await this.prisma.ticketType.delete({
      where: { id: ticketTypeId },
    });
  }
}
