import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/configs/multer.config';
import { DirectionService } from './direction.service';
import { DirectionDto } from './dto/direction.dto';
import { Direction } from '@prisma/client';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';

@Controller('directions')
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard, RoleGuard)
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
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard, RoleGuard)
  deleteDirection(@Param('directionId', ParseIntPipe) directionId: number) {
    return this.directionService.delete(directionId);
  }
}
