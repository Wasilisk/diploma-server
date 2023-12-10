import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { TourGroupService } from './tour-group.service';
import { TourGroupController } from './tour-group.controller';

@Module({
  providers: [TourGroupService],
  controllers: [TourGroupController],
  imports: [PrismaModule],
  exports: [TourGroupService],
})
export class TourGroupModule {}
