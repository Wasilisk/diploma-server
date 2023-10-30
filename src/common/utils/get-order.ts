import { Sorting } from '../interfaces';

export const getOrder = (sort?: Sorting) =>
  sort ? { [sort.property]: sort.direction } : {};
