import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Filtering, Pagination } from '../common/interfaces';
import { CreateTourDto } from './dto/create-tour.dto';
import { getImageUrl } from '../common/utils/get-image-url';
import { UpdateTourDto } from './dto/update-tour.dto';
import { parseToArray } from '../common/utils/parse-to-array';

@Injectable()
export class TourService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    images: Array<Express.Multer.File>,
    createTourDto: CreateTourDto,
  ) {
    const imagesIds = images.map((image) => getImageUrl(image.filename));
    const { tourInfo, ...otherData } = createTourDto;
    const tour = await this.prisma.tour.create({
      data: {
        gallery: imagesIds,
        tourInfo: {
          create: tourInfo,
        },
        ...otherData,
        createdBy: userId,
      },
      include: {
        tourInfo: true,
      },
    });

    return tour;
  }

  async getAll({ page, limit, size, offset }: Pagination, filters?: Filtering) {
    const query = {
      where: {
        directionId: filters?.directionId
          ? Number(filters?.directionId)
          : undefined,
        schedule: {
          OR: [
            {
              AND: [
                { startDate: { gte: filters?.startDate } },
                { startDate: { lte: filters?.endDate } },
              ],
            },
            {
              AND: [
                { endDate: { gte: filters?.startDate } },
                { endDate: { lte: filters?.endDate } },
              ],
            },
            {
              AND: [
                { startDate: { lte: filters?.startDate } },
                { endDate: { gte: filters?.endDate } },
              ],
            },
          ],
        },
        ticketTypes: {
          some: {
            AND: [
              {
                price: {
                  gte: filters?.minPrice ? Number(filters.minPrice) : undefined,
                },
              },
              {
                price: {
                  lte: filters?.maxPrice ? Number(filters.maxPrice) : undefined,
                },
              },
            ],
          },
        },
        tourInfo: {
          AND: [
            {
              groupSize: {
                gte: filters?.minGroupSize
                  ? Number(filters.minGroupSize)
                  : undefined,
              },
            },
            {
              groupSize: {
                lte: filters?.maxGroupSize
                  ? Number(filters.maxGroupSize)
                  : undefined,
              },
            },
          ],
        },
      },
      take: limit,
      skip: offset,
      include: {
        direction: true,
        tourInfo: true,
        ticketTypes: true,
        schedule: true,
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
        schedule: true,
        direction: true,
      },
    });

    return tour;
  }

  async update(
    userId: number,
    images: Array<Express.Multer.File>,
    updateTourDto: UpdateTourDto,
  ) {
    const imagesUrl = parseToArray(images).map((image) =>
      getImageUrl(image.filename),
    );
    const { id, tourInfo, gallery, ...otherData } = updateTourDto;

    const tour = await this.prisma.tour.update({
      where: { id },
      data: {
        gallery: [...parseToArray(gallery), ...imagesUrl],
        tourInfo: {
          update: {
            data: tourInfo,
          },
        },
        ...otherData,
      },
      include: {
        tourInfo: true,
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
