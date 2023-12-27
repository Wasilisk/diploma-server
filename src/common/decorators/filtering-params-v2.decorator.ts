import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { FilteringV2 } from '../interfaces';

export const FilteringParamsV2 = createParamDecorator(
  (data: string[], ctx: ExecutionContext): FilteringV2 | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;

    if (!filter) return null;

    const filterExpressions = filter.split(';');

    return filterExpressions.reduce((filters, expression) => {
      const [property, value] = expression.split(':');

      if (!data.includes(property)) {
        throw new BadRequestException(`Invalid filter property: ${property}`);
      }

      return { ...filters, [property]: value };
    }, {});
  },
);
