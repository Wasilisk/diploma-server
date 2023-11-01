import * as process from 'process';

export const getImageUrl = (filename: string) => {
  return `${process.env.API_URL}/images/${filename}`;
};
