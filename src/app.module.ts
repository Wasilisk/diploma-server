import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import {
  HttpExceptionFilter,
  ZodValidationExceptionFilter,
} from './common/filters';
import { LoggerMiddleware } from './common/middlewares/loger.middleware';
import { ConfigModule } from '@nestjs/config';
import { SupportMessageModule } from './support-message/support-message.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { DirectionModule } from './direction/direction.module';
import { TourModule } from './tour/tour.module';
import { TicketTypesModule } from './ticket-types/ticket-types.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AccountModule,
    SupportMessageModule,
    DirectionModule,
    TourModule,
    TicketTypesModule,
    PaymentModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
      serveRoot: '/',
      serveStaticOptions: { index: false, redirect: false },
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ZodValidationExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
