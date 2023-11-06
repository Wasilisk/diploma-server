import { FilterRule } from '../decorators';
import { Filtering } from '../interfaces';

function applyFilters(parsedFilters: Filtering[]) {
  let where = {};

  for (const filter of parsedFilters) {
    const { property, rule, value } = filter;
    const parsedValue = isNaN(+value) ? value : parseInt(value);
    if (rule === FilterRule.IS_NULL) {
      where = { ...where, [property]: null };
    } else if (rule === FilterRule.IS_NOT_NULL) {
      where = { ...where, [property]: { NOT: null } };
    } else if (rule === FilterRule.EQUALS) {
      where = { ...where, [property]: parsedValue };
    } else if (rule === FilterRule.NOT_EQUALS) {
      where = { ...where, [property]: { NOT: parsedValue } };
    } else if (rule === FilterRule.GREATER_THAN) {
      where = { ...where, [property]: { gt: parsedValue } };
    } else if (rule === FilterRule.GREATER_THAN_OR_EQUALS) {
      where = {
        ...where,
        OR: [{ [property]: { gt: parsedValue } }, { [property]: parsedValue }],
      };
    } else if (rule === FilterRule.LESS_THAN) {
      where = { ...where, [property]: { lt: parsedValue } };
    } else if (rule === FilterRule.LESS_THAN_OR_EQUALS) {
      where = {
        ...where,
        OR: [{ [property]: { lt: parsedValue } }, { [property]: parsedValue }],
      };
    } else if (rule === FilterRule.LIKE) {
      where = {
        ...where,
        [property]: { contains: `%${parsedValue}%`, mode: 'insensitive' },
      };
    } else if (rule === FilterRule.NOT_LIKE) {
      where = {
        ...where,
        [property]: {
          NOT: { contains: `%${parsedValue}%`, mode: 'insensitive' },
        },
      };
    } else if (rule === FilterRule.IN) {
      where = { ...where, [property]: { in: value.split(',') } };
    } else if (rule === FilterRule.NOT_IN) {
      where = { ...where, [property]: { NOT: { in: value.split(',') } } };
    }
  }

  return where;
}

export const getWhere = (parsedFilters?: Filtering[]) =>
  parsedFilters ? applyFilters(parsedFilters) : {};
