import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TourGroupService } from './tour-group.service';
import { CreateTourGroupDto } from './dto/create-tour-group.dto';

@Controller('tour-group')
export class TourGroupController {
  constructor(private readonly tourGroupService: TourGroupService) {}
  @Post()
  addTourGroup(@Body() createTourGroupDto: CreateTourGroupDto) {
    return this.tourGroupService.create(createTourGroupDto);
  }

  @Get('/:tourId')
  getTourGroupsByTourId(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.tourGroupService.getByTourId(tourId);
  }

  @Delete('/:tourGroupId')
  deleteDirection(@Param('tourGroupId', ParseIntPipe) ticketTypeId: number) {
    return this.tourGroupService.delete(ticketTypeId);
  }
}
