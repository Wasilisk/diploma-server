import { Module } from '@nestjs/common';
import { SupportMessageService } from './support-message.service';
import { SupportMessageController } from './support-message.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [SupportMessageService],
  controllers: [SupportMessageController],
  imports: [PrismaModule],
})
export class SupportMessageModule {}
