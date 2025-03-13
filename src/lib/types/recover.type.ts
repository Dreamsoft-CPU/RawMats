import { z } from "zod";

export const SendEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type SendEmailFormData = z.infer<typeof SendEmailSchema>;

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
  });

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
