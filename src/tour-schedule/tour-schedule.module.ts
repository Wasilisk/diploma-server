import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { TourScheduleService } from './tour-schedule.service';
import { TourScheduleController } from './tour-schedule.controller';

@Module({
  providers: [TourScheduleService],
  controllers: [TourScheduleController],
  imports: [PrismaModule],
  exports: [TourScheduleService],
})
export class TourScheduleModule {}
