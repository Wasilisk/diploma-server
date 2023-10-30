import { Injectable } from '@nestjs/common';
import _ from 'underscore';
import { SupportMessageDto } from './dto/support-message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, SupportMessageStatus } from '@prisma/client';
import { Filtering, Pagination, Sorting } from '../common/interfaces';
import { getWhere } from '../common/utils/get-where';
import { getOrder } from '../common/utils/get-order';
@Injectable()
export class SupportMessageService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, supportMessageDto: SupportMessageDto) {
    const supportMessage = await this.prisma.supportMessage.create({
      data: {
        userId,
        ...supportMessageDto,
      },
    });

    return supportMessage;
  }

  async getAll(
    { page, limit, size, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ) {
    const query = {
      where: getWhere(filter),
      orderBy: getOrder(sort),
      take: limit,
      skip: offset,
    };

    const [supportMessages, count] = await this.prisma.$transaction([
      this.prisma.supportMessage.findMany(query),
      this.prisma.supportMessage.count({ where: query.where }),
    ]);

    return {
      totalItems: count,
      items: supportMessages,
      page,
      size,
    };
  }

  async delete(messageId: number) {
    await this.prisma.supportMessage.delete({
      where: { id: messageId },
    });
  }
}
