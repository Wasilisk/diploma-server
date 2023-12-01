import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Filtering, Pagination } from '../common/interfaces';
import { CreateTourDto } from './dto/create-tour.dto';
import { getImageUrl } from '../common/utils/get-image-url';
import { getWhere } from '../common/utils/get-where';

@Injectable()
export class TourService {
  constructor(private prisma: PrismaService) {}

  async create(
    images: Array<Express.Multer.File>,
    createTourDto: CreateTourDto,
  ) {
    const imagesIds = images.map((image) => getImageUrl(image.filename));
    const { directionId, tourInfo, ...otherData } = createTourDto;
    const tour = await this.prisma.tour.create({
      data: {
        direction: {
          connect: {
            id: Number(directionId),
          },
        },
        gallery: imagesIds,
        tourInfo: {
          create: tourInfo,
        },
        ...otherData,
      },
      include: {
        tourInfo: true,
      },
    });

    return tour;
  }

  async getAll(
    { page, limit, size, offset }: Pagination,
    filters?: Filtering[],
  ) {
    const query = {
      where: getWhere(filters),
      take: limit,
      skip: offset,
      include: {
        tourInfo: true,
        ticketTypes: true,
      },
    };

    const [tours, count] = await this.prisma.$transaction([
      this.prisma.tour.findMany(query),
      this.prisma.tour.count({ where: query.where }),
    ]);

    return {
      totalItems: count,
      items: tours,
      page,
      size,
    };
  }

  async getById(tourId: number) {
    const tour = await this.prisma.tour.findUnique({
      where: { id: tourId },
      include: {
        tourInfo: true,
        ticketTypes: true,
      },
    });

    return tour;
  }
  async delete(tourId: number) {
    await this.prisma.tour.delete({
      where: { id: tourId },
    });
  }
}
