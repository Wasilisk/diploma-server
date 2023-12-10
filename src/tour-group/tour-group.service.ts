import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourGroupDto } from './dto/create-tour-group.dto';

interface TourGroupGetParams {
  tourId: number;
  date: string;
  time: string;
}

@Injectable()
export class TourGroupService {
  constructor(private prisma: PrismaService) {}

  async create(createTourGroupDto: CreateTourGroupDto) {
    const tourGroup = await this.prisma.tourGroup.findFirst({
      where: createTourGroupDto,
    });

    if (tourGroup) {
      throw new BadRequestException('Tour group already exist !');
    }

    return this.prisma.tourGroup.create({
      data: createTourGroupDto,
    });
  }

  async getByTourId(tourId: number) {
    return this.prisma.tourGroup.findMany({
      where: {
        tourId,
      },
    });
  }

  async getByTourDateTime(params: TourGroupGetParams) {
    return this.prisma.tourGroup.findFirst({
      where: params,
      include: {
        orders: true,
      },
    });
  }

  async delete(tourGroupId: number) {
    await this.prisma.tourGroup.delete({
      where: { id: tourGroupId },
    });
  }
}
