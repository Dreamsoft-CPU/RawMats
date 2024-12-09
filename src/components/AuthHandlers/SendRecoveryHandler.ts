"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { parseAuthError } from "./AuthErrorHandler";

export const sendResetPassword = async (email: string) => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return parseAuthError(error);
    }
    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      redirect(
        `/error?message=${encodeURIComponent(error.message)}&code=${encodeURIComponent("500")}`,
      );
    } else {
      redirect(
        `/error?message=${encodeURIComponent("An unexpected error occurred")}&code=${encodeURIComponent("500")}`,
      );
    }
  }
};
