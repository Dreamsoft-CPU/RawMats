import { LoginFormData } from "@/lib/types/login.type";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  try {
    const data: LoginFormData = await request.json();

    const { data: userData, error: userError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (userError) {
      throw new Error(userError?.message);
    }

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return NextResponse.json(
      { error: true, message: message },
      { status: 400 },
    );
  }
};
