"use server";
import { createClient } from "./supabase/client";

export const getUserId = async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("User not found");
    }

    return data.user.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};
