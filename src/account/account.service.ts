import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import _ from 'underscore';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { getImageUrl } from '../common/utils/get-image-url';
import { FilteringV2, Pagination } from '../common/interfaces';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { User, UserRole } from '@prisma/client';
import { ToggleBanUserDto } from './dto/toggle-ban-user.dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(
    userId: number,
    { page, limit, size, offset }: Pagination,
    filters?: FilteringV2,
  ) {
    const query = {
      where: {
        id: {
          not: userId,
        },
        email: {
          contains: filters?.email,
        },
        role: filters?.role as UserRole,
        profile: {
          firstName: {
            contains: filters?.firstName,
          },
          lastName: {
            contains: filters?.lastName,
          },
        },
      },
      include: {
        profile: true,
      },
      take: limit,
      skip: offset,
    };

    const [users, count] = await this.prisma.$transaction([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    return {
      totalItems: count,
      items: users,
      page,
      size,
    };
  }

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

  async changeUserRole(userId: number, changeUserRole: ChangeUserRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (this.isRoleChangeNotAllowed(user, changeUserRole)) {
      throw new ForbiddenException();
    }

    await this.prisma.user.update({
      where: { id: changeUserRole.id },
      data: { role: changeUserRole.role },
    });
  }

  async toggleBanUser({ userId }: ToggleBanUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }

    const newBanStatus = !user.isBanned;

    await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: newBanStatus },
    });
  }

  private isRoleChangeNotAllowed(
    user: User | null,
    changeUserRole: ChangeUserRoleDto,
  ): boolean {
    return (
      user?.role === UserRole.MODERATOR &&
      (changeUserRole.role === UserRole.ADMIN ||
        changeUserRole.role === UserRole.MODERATOR)
    );
  }
}
