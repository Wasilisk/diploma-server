import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { Filtering } from '../interfaces';

export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}

export const FilteringParams = createParamDecorator(
  (data, ctx: ExecutionContext): Filtering | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;
    if (!filter) return null;

    if (typeof data != 'object')
      throw new BadRequestException('Invalid filter parameter');

    if (
      !filter.match(
        /^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9_,]+$/,
      ) &&
      !filter.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull)$/)
    ) {
      throw new BadRequestException('Invalid filter parameter');
    }

    const [property, rule, value] = filter.split(':');
    if (!data.includes(property))
      throw new BadRequestException(`Invalid filter property: ${property}`);
    if (!Object.values(FilterRule).includes(rule as FilterRule))
      throw new BadRequestException(`Invalid filter rule: ${rule}`);

    return { property, rule, value };
  },
);
