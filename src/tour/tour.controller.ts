import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/configs/multer.config';
import { TourService } from './tour.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { Tour } from '@prisma/client';
import { FilteringParams, PaginationParams } from '../common/decorators';
import { Filtering, PaginatedResource, Pagination } from '../common/interfaces';

@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  addTour(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTourDto: CreateTourDto,
  ) {
    return this.tourService.create(file, createTourDto);
  }
  @Get()
  getAllTours(
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams(['directionId']) filters?: Filtering[],
  ): Promise<PaginatedResource<Partial<Tour>>> {
    return this.tourService.getAll(paginationParams, filters);
  }
  @Delete('/:tourId')
  deleteTour(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.tourService.delete(tourId);
  }
}
