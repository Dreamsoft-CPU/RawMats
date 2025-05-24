import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .max(256, "Email must be at most 256 characters"),
    displayName: z
      .string()
      .min(3, "Display name must be at least 3 characters")
      .max(50, "Display name must be at most 50 characters"),
    phoneNumber: z
      .string()
      .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(256, "Password must be at most 256 characters")
      .refine((pwd) => /[A-Z]/.test(pwd), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((pwd) => /[a-z]/.test(pwd), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((pwd) => /\d/.test(pwd), {
        message: "Password must contain at least one number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;
