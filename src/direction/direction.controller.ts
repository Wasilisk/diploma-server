import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/configs/multer.config';
import { DirectionService } from './direction.service';
import { DirectionDto } from './dto/direction.dto';
import { Direction } from '@prisma/client';

@Controller('directions')
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  addDirection(
    @UploadedFile() file: Express.Multer.File,
    @Body() directionDto: DirectionDto,
  ) {
    return this.directionService.create(file, directionDto);
  }

  @Get()
  getAllDirections(): Promise<Partial<Direction>[]> {
    return this.directionService.getAll();
  }

  @Get('/:directionId')
  getDirectionById(@Param('directionId', ParseIntPipe) directionId: number) {
    return this.directionService.getById(directionId);
  }

  @Delete('/:directionId')
  deleteDirection(@Param('directionId', ParseIntPipe) directionId: number) {
    return this.directionService.delete(directionId);
  }
}
