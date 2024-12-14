import { z } from 'zod';

// Esquema de validação para cadastro de usuário
export const createUserSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('O e-mail é inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// Esquema de validação para login de usuário
export const loginUserSchema = z.object({
  email: z.string().email('O e-mail é inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// Tipo inferido do esquema de cadastro
export type CreateUserInput = z.infer<typeof createUserSchema>;

// Tipo inferido do esquema de login
export type LoginUserInput = z.infer<typeof loginUserSchema>;
