"use server";

import { createClient } from "../supabase/server";

export const getUserData = async () => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (!data.user || error) {
      throw new Error(error?.message || "User not found!");
    }

    return data.user;
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return {
      error: true,
      message,
    };
  }
};
