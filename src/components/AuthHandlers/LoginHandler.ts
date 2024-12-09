"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { parseAuthError } from "./AuthErrorHandler";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function login(formData: FormData) {
  try {
    const parseResult = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(errorMessage);
    }

    const { email, password } = parseResult.data;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
}

export async function logout() {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    revalidatePath("/", "layout");
    redirect("/login");
  } catch (error) {
    if (error instanceof Error) {
      redirect(
        `/error?message=${encodeURIComponent(error.message)}&code=${encodeURIComponent("500")}`,
      );
    } else {
      redirect(
        `/error?message=${encodeURIComponent("An unexpected error occurred during logout")}&code=${encodeURIComponent("500")}`,
      );
    }
  }
}
