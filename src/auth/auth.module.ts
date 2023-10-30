import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { constants } from '../common/utils/constants';
import { HttpModule } from '@nestjs/axios';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    MailModule,
    HttpModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: constants.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
