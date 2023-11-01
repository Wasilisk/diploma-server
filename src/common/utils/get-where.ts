import { FilterRule } from '../decorators';
import { Filtering } from '../interfaces';

export const parseFilter = (filter: Filtering) => {
  if (!filter) return {};

  if (filter.rule == FilterRule.IS_NULL) return { [filter.property]: null };
  if (filter.rule == FilterRule.IS_NOT_NULL)
    return { NOT: { [filter.property]: null } };
  if (filter.rule == FilterRule.EQUALS)
    return { [filter.property]: filter.value };
  if (filter.rule == FilterRule.NOT_EQUALS)
    return { NOT: { [filter.property]: filter.value } };
  if (filter.rule == FilterRule.GREATER_THAN)
    return { [filter.property]: { gt: filter.value } };
  if (filter.rule == FilterRule.GREATER_THAN_OR_EQUALS)
    return {
      OR: [
        { [filter.property]: { gt: filter.value } },
        { [filter.property]: filter.value },
      ],
    };
  if (filter.rule == FilterRule.LESS_THAN)
    return { [filter.property]: { lt: filter.value } };
  if (filter.rule == FilterRule.LESS_THAN_OR_EQUALS)
    return {
      OR: [
        { [filter.property]: { lt: filter.value } },
        { [filter.property]: filter.value },
      ],
    };
  if (filter.rule == FilterRule.LIKE)
    return {
      [filter.property]: { contains: `%${filter.value}%`, mode: 'insensitive' },
    };
  if (filter.rule == FilterRule.NOT_LIKE)
    return {
      NOT: {
        [filter.property]: {
          contains: `%${filter.value}%`,
          mode: 'insensitive',
        },
      },
    };
  if (filter.rule == FilterRule.IN)
    return { [filter.property]: { in: filter.value.split(',') } };
  if (filter.rule == FilterRule.NOT_IN)
    return { NOT: { [filter.property]: { in: filter.value.split(',') } } };
};

export const getWhere = (filter?: Filtering) =>
  filter ? parseFilter(filter) : {};
