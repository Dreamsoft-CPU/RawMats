"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
};
