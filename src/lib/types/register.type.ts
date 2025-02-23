import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    displayName: z
      .string()
      .min(3, "Display name must be at least 3 characters"),
    phoneNumber: z
      .string()
      .length(11, "Phone number must start with a 0 and be 11 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;
