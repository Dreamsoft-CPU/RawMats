"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/client";
import { parseAuthError } from "./AuthErrorHandler";

const SignupSchema = z
  .object({
    name: z
      .string()
      .min(6, { message: "Name must be at least 6 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().regex(/^09\d{9}$/, {
      message: "Phone number must be 11 digits and start with '09'",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export async function signup(formData: FormData) {
  try {
    const result = SignupSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(errorMessage);
    }

    const { name, email, phone, password } = result.data;

    const supabase = createClient();

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          phone: phone,
        },
      },
    });

    if (data.user) {
      const { user } = data;
      const uniqueUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!uniqueUser) {
        console.log("First time login");
        let email: string = "no-email";
        let display_name: string = "no-name";

        if (user.email) {
          email = user.email;
        }

        if (user.user_metadata.display_name) {
          display_name = user.user_metadata.display_name;
        }

        await prisma.user.create({
          data: {
            id: user.id,
            email: email,
            displayName: display_name,
          },
        });
      }
    }

    console.log(data);

    if (error) {
      return parseAuthError(error);
    }

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      redirect(`/error?message=${encodeURIComponent(error.message)}`);
    } else {
      redirect(
        `/error?message=${encodeURIComponent("An unexpected error occurred")}`,
      );
    }
  }
}
