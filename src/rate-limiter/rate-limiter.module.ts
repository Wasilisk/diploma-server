import { Module } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [RateLimiterService],
  imports: [PrismaModule],
  exports: [RateLimiterService],
})
export class RateLimiterModule {}
