import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GuidePermissionService } from './guide-permission.service';
import { GuidePermissionController } from './guide-permission.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [GuidePermissionController],
  providers: [GuidePermissionService],
  exports: [GuidePermissionService],
  imports: [PrismaModule, MailModule],
})
export class GuidePermissionModule {}
