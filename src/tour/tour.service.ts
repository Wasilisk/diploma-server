import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Filtering, Pagination } from '../common/interfaces';
import { CreateTourDto } from './dto/create-tour.dto';
import { getImageUrl } from '../common/utils/get-image-url';
import { getWhere } from '../common/utils/get-where';
@Injectable()
export class TourService {
  constructor(private prisma: PrismaService) {}

  async create(image: Express.Multer.File, createTourDto: CreateTourDto) {
    const coverImage = getImageUrl(image.filename);
    const { price, directionId, ...otherData } = createTourDto;
    const tour = await this.prisma.tour.create({
      data: {
        direction: {
          connect: {
            id: Number(directionId),
          },
        },
        price: Number(price),
        coverImage,
        ...otherData,
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

  async delete(tourId: number) {
    await this.prisma.tour.delete({
      where: { id: tourId },
    });
  }
}
