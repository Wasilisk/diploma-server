export const normalizeArray = <T>(
  arr: T[],
  key: keyof T,
): Record<string, T> => {
  return arr.reduce(
    (result, obj) => {
      const keyValue = obj[key] as string;
      result[keyValue] = obj;
      return result;
    },
    {} as Record<string, T>,
  );
};
