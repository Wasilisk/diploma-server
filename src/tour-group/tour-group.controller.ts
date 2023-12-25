import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TourGroupService } from './tour-group.service';
import { CreateTourGroupDto } from './dto/create-tour-group.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';

@Controller('tour-group')
export class TourGroupController {
  constructor(private readonly tourGroupService: TourGroupService) {}
  @Post()
  @Roles([Role.GUIDE])
  @UseGuards(AuthGuard, RoleGuard)
  addTourGroup(@Body() createTourGroupDto: CreateTourGroupDto) {
    return this.tourGroupService.create(createTourGroupDto);
  }

  @Get('/:tourGroupId')
  getTourGroupsByTourId(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.tourGroupService.getByTourId(tourId);
  }

  @Delete('/:tourGroupId')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard, RoleGuard)
  deleteTourGroup(@Param('tourGroupId', ParseIntPipe) ticketTypeId: number) {
    return this.tourGroupService.delete(ticketTypeId);
  }
}
