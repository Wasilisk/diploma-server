import { createZodDto } from 'nestjs-zod';
import { TourScheduleSchema } from '../../common/schemas/tour-schedule.schema';

export class CreateTourScheduleDto extends createZodDto(TourScheduleSchema) {}
