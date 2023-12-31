import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post, Put,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";

import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/configs/multer.config';
import { DirectionService } from './direction.service';
import { DirectionDto } from './dto/direction.dto';
import { Direction } from '@prisma/client';
import { PaginationParams, Roles, SortingParams } from "../common/decorators";
import { Role } from '../common/enums';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import {
  FilteringV2,
  PaginatedResource,
  Pagination, Sorting
} from "../common/interfaces";
import { FilteringParamsV2 } from '../common/decorators/filtering-params-v2.decorator';
import { UpdateDirectionDto } from "./dto/update-direction.dto";

@Controller('directions')
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}
  @Post()
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  addDirection(
    @UploadedFile() file: Express.Multer.File,
    @Body() directionDto: DirectionDto,
  ) {
    return this.directionService.create(file, directionDto);
  }

  @Get()
  getAllDirections(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['tours']) sort?: Sorting,
    @FilteringParamsV2(['name']) filters?: FilteringV2,
  ): Promise<PaginatedResource<Partial<Direction>>> {
    return this.directionService.getAll(paginationParams, sort, filters);
  }

  @Get('/:directionId')
  getDirectionById(@Param('directionId', ParseIntPipe) directionId: number) {
    return this.directionService.getById(directionId);
  }

  @Put()
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updateDirection(
    @Body() updateDirectionDto: UpdateDirectionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.directionService.update(updateDirectionDto, file);
  }

  @Delete('/:directionId')
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  deleteDirection(@Param('directionId', ParseIntPipe) directionId: number) {
    return this.directionService.delete(directionId);
  }
}
