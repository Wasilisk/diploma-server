import { isArray } from 'underscore';

export const parseToArray = <T>(value: T | T[]): T[] => {
  if (isArray(value)) return value;
  return [value];
};
