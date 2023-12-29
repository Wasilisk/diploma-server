import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuidePermissionRequestDto } from './dto/create-guide-permission-request.dto';
import { UpdateGuidePermissionRequestStatusDto } from './dto/update-guide-permission-request-status.dto';
import { GuidePermissionRequestStatus, UserRole } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { FilteringV2, Pagination, Sorting } from '../common/interfaces';
import { getOrder } from '../common/utils/get-order';
import { generate } from 'generate-password';

@Injectable()
export class GuidePermissionService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createRequest(
    createGuidePermissionRequestDto: CreateGuidePermissionRequestDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createGuidePermissionRequestDto.email,
      },
    });

    if (user) {
      throw new ForbiddenException(
        'User with this email is already registered',
      );
    }

    return await this.prisma.guidePermissionRequest.create({
      data: createGuidePermissionRequestDto,
    });
  }

  async getAll(
    { page, limit, size, offset }: Pagination,
    sort?: Sorting,
    filters?: FilteringV2,
  ) {
    const query = {
      where: {
        status: filters?.status as GuidePermissionRequestStatus,
      },
      orderBy: getOrder(sort),
      take: limit,
      skip: offset,
    };

    const [guidePermissionRequest, count] = await this.prisma.$transaction([
      this.prisma.guidePermissionRequest.findMany(query),
      this.prisma.guidePermissionRequest.count({ where: query.where }),
    ]);

    return {
      totalItems: count,
      items: guidePermissionRequest,
      page,
      size,
    };
  }

  async updateRequestStatus({
    id,
    status,
  }: UpdateGuidePermissionRequestStatusDto) {
    const guidePermissionRequest =
      await this.prisma.guidePermissionRequest.findUnique({
        where: { id },
      });

    if (!guidePermissionRequest) {
      throw new BadRequestException('Request does not exist');
    }

    if (status === GuidePermissionRequestStatus.ACCEPTED) {
      const password = generate({
        length: 10,
        numbers: true,
      });
      const user = await this.prisma.user.findUnique({
        where: { email: guidePermissionRequest.email },
      });

      if (user) {
        await this.mailService.sendGuideRequestResponse(user.email);
      } else {
        await this.mailService.sendGuideRequestResponse(
          guidePermissionRequest.email,
          password,
        );
      }

      await this.prisma.user.upsert({
        where: { email: guidePermissionRequest.email },
        update: {
          role: UserRole.GUIDE,
        },
        create: {
          email: guidePermissionRequest.email,
          phone: guidePermissionRequest.phone,
          password,
          role: UserRole.GUIDE,
          profile: {
            create: {
              firstName: guidePermissionRequest.firstName,
              lastName: guidePermissionRequest.lastName,
            },
          },
        },
      });
    } else if (status === GuidePermissionRequestStatus.DECLINED) {
      await this.mailService.sendGuideRequestRefusal(
        guidePermissionRequest.email,
      );
    }

    return await this.prisma.guidePermissionRequest.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async deleteRequest(requestId: number) {
    await this.prisma.guidePermissionRequest.delete({
      where: { id: requestId },
    });
  }
}
