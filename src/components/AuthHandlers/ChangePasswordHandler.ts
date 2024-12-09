"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { parseAuthError } from "./AuthErrorHandler";

export const updatePassword = async (newPassword: string) => {
  try {
    const supabase = createClient();
    const PasswordSchema = z.object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
    });

    const result = PasswordSchema.safeParse({ password: newPassword });
    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(errorMessage);
    }

    const { password } = result.data;
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return parseAuthError(error);
    }
    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      redirect(
        `/error?message=${encodeURIComponent(error.message)}&code=${encodeURIComponent("400")}`,
      );
    } else {
      redirect(
        `/error?message=${encodeURIComponent("An unexpected error occurred")}&code=${encodeURIComponent("500")}`,
      );
    }
  }
};
