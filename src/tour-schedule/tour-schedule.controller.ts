import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateTourScheduleDto } from './dto/create-tour-schedule.dto';
import { TourScheduleService } from './tour-schedule.service';

@Controller('tour-schedule')
export class TourScheduleController {
  constructor(private readonly tourScheduleService: TourScheduleService) {}
  @Post()
  addTicketTypes(@Body() createTourScheduleDto: CreateTourScheduleDto) {
    return this.tourScheduleService.create(createTourScheduleDto);
  }

  @Get('/:tourId')
  getTicketTypesById(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.tourScheduleService.getByTourId(tourId);
  }

  @Delete('/:tourScheduleId')
  deleteDirection(
    @Param('tourScheduleId', ParseIntPipe) tourScheduleId: number,
  ) {
    return this.tourScheduleService.delete(tourScheduleId);
  }
}
