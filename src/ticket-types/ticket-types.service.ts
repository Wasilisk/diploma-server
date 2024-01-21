import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';

@Injectable()
export class TicketTypesService {
  constructor(private prisma: PrismaService) {}

  async createMany(ticketTypesDto: CreateTicketTypeDto[]) {
    return this.prisma.ticketType.createMany({
      data: ticketTypesDto,
    });
  }
  async updateMany(updateTicketTypesDto: UpdateTicketTypeDto[]) {
    const transaction = await this.prisma.$transaction(
      updateTicketTypesDto.map((ticketData) =>
        this.prisma.ticketType.update({
          where: { id: ticketData.id },
          data: { name: ticketData.name, price: ticketData.price },
        }),
      ),
    );
    return transaction;
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
