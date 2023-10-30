import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import _ from 'underscore';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: number) {
    const user = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      user: _.omit(user, 'password'),
    };
  }
}
