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
import { TicketTypesService } from './ticket-types.service';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';

@Controller('ticket-types')
export class TicketTypesController {
  constructor(private readonly ticketTypesService: TicketTypesService) {}
  @Post()
  @Roles([Role.GUIDE, Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  addTicketTypes(@Body() ticketTypeDto: CreateTicketTypeDto[]) {
    return this.ticketTypesService.createMany(ticketTypeDto);
  }

  @Patch()
  @Roles([Role.GUIDE, Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  updateTicketTypes(@Body() updateTicketTypeDto: UpdateTicketTypeDto[]) {
    return this.ticketTypesService.updateMany(updateTicketTypeDto);
  }

  @Get('/:tourId')
  getTicketTypesById(@Param('tourId', ParseIntPipe) tourId: number) {
    return this.ticketTypesService.getByTourId(tourId);
  }

  @Delete('/:ticketTypeId')
  @Roles([Role.GUIDE])
  @UseGuards(AuthGuard, RoleGuard)
  deleteDirection(@Param('ticketTypeId', ParseIntPipe) ticketTypeId: number) {
    return this.ticketTypesService.delete(ticketTypeId);
  }
}
