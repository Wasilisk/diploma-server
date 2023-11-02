import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import _ from 'underscore';

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
}
