import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DirectionDto } from './dto/direction.dto';
import { getImageUrl } from '../common/utils/get-image-url';

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
    const directions = await this.prisma.direction.findMany({
      include: {
        _count: true,
      },
    });

    return directions;
  }

  async getById(directionId: number) {
    const direction = await this.prisma.direction.findUnique({
      where: {
        id: directionId,
      },
      include: {
        tours: true,
        _count: true,
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
