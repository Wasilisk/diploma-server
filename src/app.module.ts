import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { RawBodyMiddleware } from './common/middlewares/raw-body.middleware';
import { JsonBodyMiddleware } from './common/middlewares/json-body.middleware';
import { OrderModule } from './order/order.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TourScheduleModule } from './tour-schedule/tour-schedule.module';
import { TourGroupModule } from './tour-group/tour-group.module';
import { AccessControlModule } from './access-control/access-control.module';
import { GuidePermissionModule } from "./guide-permission/guide-permission.module";

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
    OrderModule,
    TourScheduleModule,
    TourGroupModule,
    AccessControlModule,
    GuidePermissionModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
      serveRoot: '/',
      serveStaticOptions: { index: false, redirect: false },
    }),
    ScheduleModule.forRoot(),
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
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({ path: '/webhook', method: RequestMethod.POST })
      .apply(LoggerMiddleware, JsonBodyMiddleware)
      .forRoutes('*');
  }
}
