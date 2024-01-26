import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/configs/multer.config';
import { TourService } from './tour.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { Tour } from '@prisma/client';
import { GetUserId, PaginationParams, Roles } from '../common/decorators';
import { Filtering, PaginatedResource, Pagination } from '../common/interfaces';
import { Role } from '../common/enums';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { UpdateTourDto } from './dto/update-tour.dto';
import { FilteringParams } from '../common/decorators/filtering-params.decorator';

@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}
  @Post()
  @Roles([Role.GUIDE, Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FilesInterceptor('files[]', 10, multerOptions))
  addTour(
    @GetUserId() userId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createTourDto: CreateTourDto,
  ) {
    return this.tourService.create(userId, files, createTourDto);
  }

  @Patch()
  @Roles([Role.GUIDE, Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FilesInterceptor('files[]', 10, multerOptions))
  uodateTour(
    @GetUserId() userId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() updateTourDto: UpdateTourDto,
  ) {
    return this.tourService.update(userId, files, updateTourDto);
  }

  @Get()
  getAllTours(
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams([
      'directionId',
      'startDate',
      'endDate',
      'minPrice',
      'maxPrice',
      'minGroupSize',
      'maxGroupSize',
    ])
    filters?: Filtering,
  ): Promise<PaginatedResource<Partial<Tour>>> {
    return this.tourService.getAll(paginationParams, filters);
  }

  @Get('/:tourId')
  getById(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.tourService.getById(tourId);
  }

  @Roles([Role.GUIDE, Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/:tourId')
  deleteTour(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.tourService.delete(tourId);
  }
}
