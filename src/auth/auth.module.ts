import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { constants } from '../common/utils/constants';
import { HttpModule } from '@nestjs/axios';
import { RateLimiterModule } from 'src/rate-limiter/rate-limiter.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    HttpModule,
    PrismaModule,
    RateLimiterModule,
    JwtModule.register({
      global: true,
      secret: constants.jwtSecret,
      signOptions: { expiresIn: '2 days' },
    }),
  ],
})
export class AuthModule {}
