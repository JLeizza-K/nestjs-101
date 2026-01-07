import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.number(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
