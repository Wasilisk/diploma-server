import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { DirectionController } from './direction.controller';
import { DirectionService } from './direction.service';

@Module({
  providers: [DirectionService],
  controllers: [DirectionController],
  imports: [PrismaModule],
})
export class DirectionModule {}
