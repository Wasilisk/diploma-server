import * as bcrypt from 'bcrypt';
import { constants } from './constants';

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, constants.saltRounds);
  return hash;
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
