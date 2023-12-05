import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { TicketTypesService } from './ticket-types.service';
import { TicketTypesController } from './ticket-types.controller';

@Module({
  providers: [TicketTypesService],
  controllers: [TicketTypesController],
  imports: [PrismaModule],
  exports: [TicketTypesService],
})
export class TicketTypesModule {}
