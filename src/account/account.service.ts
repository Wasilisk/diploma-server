import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import _ from 'underscore';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { getImageUrl } from '../common/utils/get-image-url';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return _.omit(user, 'password', 'confirmationToken');
  }

  async updateUserProfile(
    { email, phone, ...profileInfo }: UpdateUserProfileDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    await this.validateUniqueUserField(
      'email',
      email,
      'Цей емейл вже використовується',
      userId,
    );
    await this.validateUniqueUserField(
      'phone',
      phone,
      'Цей номер вже використовується',
      userId,
    );

    await this.prisma.$transaction([
      this.prisma.profile.update({
        where: { id: userId },
        data: {
          ...profileInfo,
          profilePicture: file
            ? getImageUrl(file.filename)
            : profileInfo.profilePicture,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { email, phone },
      }),
    ]);
  }

  private async validateUniqueUserField(
    field: string,
    value: string,
    errorMessage: string,
    userId: number,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { [field]: value, id: { not: userId } },
    });
    if (user) {
      throw new BadRequestException(errorMessage);
    }
  }
}
