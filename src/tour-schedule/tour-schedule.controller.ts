import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post, UseGuards,
} from '@nestjs/common';
import { CreateTourScheduleDto } from './dto/create-tour-schedule.dto';
import { TourScheduleService } from './tour-schedule.service';
import {Roles} from "../common/decorators";
import {Role} from "../common/enums";
import {AuthGuard} from "../common/guards/auth.guard";
import {RoleGuard} from "../common/guards/role.guard";

@Controller('tour-schedule')
export class TourScheduleController {
  constructor(private readonly tourScheduleService: TourScheduleService) {}
  @Post()
  @Roles([Role.GUIDE])
  @UseGuards(AuthGuard, RoleGuard)
  addTicketTypes(@Body() createTourScheduleDto: CreateTourScheduleDto) {
    return this.tourScheduleService.create(createTourScheduleDto);
  }

  @Get('/:tourId')
  getTicketTypesById(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.tourScheduleService.getByTourId(tourId);
  }

  @Delete('/:tourScheduleId')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard, RoleGuard)
  deleteDirection(
    @Param('tourScheduleId', ParseIntPipe) tourScheduleId: number,
  ) {
    return this.tourScheduleService.delete(tourScheduleId);
  }
}
