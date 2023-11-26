import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  addTour(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createTourDto: CreateTourDto,
  ) {
    return this.tourService.create(files, createTourDto);
  }
  @Get()
  getAllTours(
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams(['directionId']) filters?: Filtering[],
  ): Promise<PaginatedResource<Partial<Tour>>> {
    return this.tourService.getAll(paginationParams, filters);
  }

  @Get('/:tourId')
  getById(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.tourService.getById(tourId);
  }
  @Delete('/:tourId')
  deleteTour(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.tourService.delete(tourId);
  }
}
