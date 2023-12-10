import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';

@Module({
  providers: [TourService],
  controllers: [TourController],
  imports: [PrismaModule],
  exports: [TourService],
})
export class TourModule {}
