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

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AccountModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SupportMessageModule,
  ],
  controllers: [],
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
