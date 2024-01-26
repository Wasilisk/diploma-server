import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupportMessageDto } from './dto/support-message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Filtering, Pagination, Sorting } from '../common/interfaces';
import { getOrder } from '../common/utils/get-order';
import { SupportMessageStatus } from '@prisma/client';
import { UpdateSupportMessageDto } from './dto/update-support-message.dto';
import { ReplyToSupportMessageDto } from './dto/reply-to-support-message.dto';
import { MailService } from '../mail/mail.service';
@Injectable()
export class SupportMessageService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

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
    filters?: Filtering,
  ) {
    const query = {
      where: {
        status: filters?.status as SupportMessageStatus,
      },
      orderBy: getOrder(sort),
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                profilePicture: true,
              },
            },
          },
        },
      },
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

  async updateStatus({ id, status }: UpdateSupportMessageDto) {
    await this.prisma.supportMessage.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async replyToMessage({ id, content }: ReplyToSupportMessageDto) {
    await this.updateStatus({
      id,
      status: SupportMessageStatus.RESOLVED,
    });

    const user = await this.prisma.supportMessage
      .findUnique({
        where: { id: id },
      })
      .user();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.mailService.replyToSupportMessage(user.email, {
      content,
    });
  }
}
