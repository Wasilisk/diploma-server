import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTourScheduleDto } from './dto/create-tour-schedule.dto';
import { TourScheduleService } from './tour-schedule.service';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { UpdateTourScheduleDto } from "./dto/update-tour-schedule.dto";

@Controller('tour-schedule')
export class TourScheduleController {
  constructor(private readonly tourScheduleService: TourScheduleService) {}
  @Post()
  @Roles([Role.GUIDE, Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  addTourSchedule(@Body() createTourScheduleDto: CreateTourScheduleDto) {
    return this.tourScheduleService.create(createTourScheduleDto);
  }

  @Patch()
  @Roles([Role.GUIDE, Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  updateTourSchedule(@Body() updateTourScheduleDto: UpdateTourScheduleDto) {
    return this.tourScheduleService.update(updateTourScheduleDto);
  }

  @Get('/:tourId')
  getTourScheduleById(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.tourScheduleService.getByTourId(tourId);
  }

  @Delete('/:tourScheduleId')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard, RoleGuard)
  deleteTourSchedule(
    @Param('tourScheduleId', ParseIntPipe) tourScheduleId: number,
  ) {
    return this.tourScheduleService.delete(tourScheduleId);
  }
}
