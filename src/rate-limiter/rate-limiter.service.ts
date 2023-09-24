import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subSeconds } from 'date-fns';

@Injectable()
export class RateLimiterService {
  constructor(private prisma: PrismaService) {}

  async isRateLimited(
    userIp: string,
    endpoint: string,
    requestCount: number,
    duration: number,
  ): Promise<boolean> {
    const ago = subSeconds(new Date(), duration);

    const incorrectRequests = await this.prisma.rateLimit.count({
      where: {
        userIp: userIp,
        endpoint,
        timestamp: {
          gte: ago,
        },
      },
    });

    return incorrectRequests >= requestCount;
  }

  async recordRequest(userIp: string, endpoint: string): Promise<void> {
    await this.prisma.rateLimit.create({
      data: {
        userIp: userIp,
        endpoint,
      },
    });
  }
}
