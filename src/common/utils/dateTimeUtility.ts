import { addMinutes, isBefore } from 'date-fns';

export const getExpiry = () => {
  const createdAt = new Date();
  const expiresAt = addMinutes(createdAt, 5);
  return expiresAt;
};

export function isTokenExpired(expiry: Date): boolean {
  const currentDate = new Date();
  return isBefore(expiry, currentDate);
}
