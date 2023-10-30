import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { Sorting, SortingDirection } from '../interfaces';

export const SortingParams = createParamDecorator(
  (validParams, ctx: ExecutionContext): Sorting | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;
    if (!sort) return null;

    if (typeof validParams != 'object')
      throw new BadRequestException('Invalid sort parameter');

    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    if (!sort.match(sortPattern))
      throw new BadRequestException('Invalid sort parameter');

    const [property, direction] = sort.split(':');
    if (!validParams.includes(property))
      throw new BadRequestException(`Invalid sort property: ${property}`);
    if (!['desc', 'asc'].includes(direction))
      throw new BadRequestException(`Invalid direction property: ${property}`);

    return { property, direction: direction as SortingDirection };
  },
);
