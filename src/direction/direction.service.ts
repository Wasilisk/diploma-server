import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DirectionDto } from './dto/direction.dto';
import { getImageUrl } from '../common/utils/get-image-url';
import { Filtering, Pagination, Sorting } from '../common/interfaces';
import { getWhere } from '../common/utils/get-where';
import { getOrder } from '../common/utils/get-order';

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

  async getAll() {
    const directions = await this.prisma.direction.findMany();

    return directions;
  }

  async delete(directionId: number) {
    await this.prisma.direction.delete({
      where: { id: directionId },
    });
  }
}
