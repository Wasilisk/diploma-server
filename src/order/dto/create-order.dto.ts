import { createZodDto } from 'nestjs-zod';
import { OrderSchema } from '../../common/schemas/order.schema';

export class CreateOrderDto extends createZodDto(OrderSchema) {}
