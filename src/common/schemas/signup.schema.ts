import { z } from 'nestjs-zod/z';

export const signUpSchema = z
  .object({
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    firstName: z.string(),
    lastName: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
