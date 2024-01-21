import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourScheduleDto } from './dto/create-tour-schedule.dto';
import { UpdateTourScheduleDto } from './dto/update-tour-schedule.dto';

@Injectable()
export class TourScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(tourScheduleDto: CreateTourScheduleDto) {
    return this.prisma.tourSchedule.create({
      data: tourScheduleDto,
    });
  }

  async update(updateTourScheduleDto: UpdateTourScheduleDto) {
    const { tourId, ...otherData } = updateTourScheduleDto;
    return this.prisma.tourSchedule.update({
      where: { tourId },
      data: otherData,
    });
  }

  async getByTourId(tourId: number) {
    return this.prisma.tourSchedule.findUnique({
      where: {
        tourId,
      },
    });
  }

  async delete(tourScheduleId: number) {
    await this.prisma.tourSchedule.delete({
      where: { id: tourScheduleId },
    });
  }
}
