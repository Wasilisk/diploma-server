import { z } from 'nestjs-zod/z';

export const signUpSchema = z
  .object({
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min(8),
    confirm: z.string().min(8),
    firstName: z.string(),
    lastName: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })
  .refine((data) => /[A-Z]/.test(data.password), {
    message: 'Password must contain at least one uppercase letter',
    path: ['password'],
  })
  .refine((data) => /[a-z]/.test(data.password), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((data) => /\d/.test(data.password), {
    message: 'Password must contain at least one digit',
    path: ['password'],
  })
  .refine((data) => /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/.test(data.password), {
    message: 'Password must contain at least one special character',
    path: ['password'],
  });
