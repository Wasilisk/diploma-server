import { z } from 'nestjs-zod/z';

export const updateUserProfileSchema = z.object({
  phone: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  profilePicture: z.string(),
});
