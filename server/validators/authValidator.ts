import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
}).strict(); 

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
}).strict();

export const googleLoginSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
}).strict();

export const refreshSchema = z.object({}).strict();

export const logoutSchema = z.object({}).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;