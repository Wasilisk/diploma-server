import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TicketTypesService } from './ticket-types.service';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';

@Controller('ticket-types')
export class TicketTypesController {
  constructor(private readonly ticketTypesService: TicketTypesService) {}
  @Post()
  addTicketTypes(@Body() ticketTypeDto: CreateTicketTypeDto[]) {
    return this.ticketTypesService.createMany(ticketTypeDto);
  }

  @Get('/:tourId')
  getTicketTypesById(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.ticketTypesService.getByTourId(tourId);
  }

  @Delete('/:ticketTypeId')
  deleteDirection(@Param('ticketTypeId', ParseIntPipe) ticketTypeId: number) {
    return this.ticketTypesService.delete(ticketTypeId);
  }
}
