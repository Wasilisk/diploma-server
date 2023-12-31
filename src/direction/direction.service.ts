import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DirectionDto } from './dto/direction.dto';
import { getImageUrl } from '../common/utils/get-image-url';
import {
  FilteringV2,
  Pagination,
  Sorting,
  SortingDirection,
} from '../common/interfaces';
import { UpdateDirectionDto } from './dto/update-direction.dto';

@Injectable()
export class DirectionService {
  constructor(private prisma: PrismaService) {}

  async create(image: Express.Multer.File, directionDto: DirectionDto) {
    const imageUrl = getImageUrl(image.filename);
    const direction = await this.prisma.direction.create({
      data: {
        ...directionDto,
        image: imageUrl,
      },
    });

    return direction;
  }

  async getAll(
    { page, limit, size, offset }: Pagination,
    sort?: Sorting,
    filters?: FilteringV2,
  ) {
    const query = {
      where: {
        name: {
          startsWith: filters?.name,
        },
      },
      include: {
        _count: {
          select: {
            tours: true,
          },
        },
      },
      orderBy: sort
        ? {
            tours: {
              _count: sort.direction as SortingDirection,
            },
          }
        : {},

      take: limit,
      skip: offset,
    };

    const [directions, count] = await this.prisma.$transaction([
      this.prisma.direction.findMany(query),
      this.prisma.direction.count({ where: query.where }),
    ]);

    return {
      totalItems: count,
      items: directions,
      page,
      size,
    };
  }

  async update(
    updateDirectionDto: UpdateDirectionDto,
    image?: Express.Multer.File,
  ) {
    const direction = await this.prisma.direction.update({
      where: { id: Number(updateDirectionDto.id) },
      data: {
        name: updateDirectionDto.name,
        image: image ? getImageUrl(image.filename) : updateDirectionDto.image,
      },
    });

    return direction;
  }

  async getById(directionId: number) {
    const direction = await this.prisma.direction.findUnique({
      where: {
        id: directionId,
      },
    });

    return direction;
  }

  async delete(directionId: number) {
    await this.prisma.direction.delete({
      where: { id: directionId },
    });
  }
}
