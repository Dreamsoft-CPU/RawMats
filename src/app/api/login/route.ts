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

    if (!userData.user) {
      throw new Error("User does not exist!");
    }

    const currentUrl = request.nextUrl.clone();
    currentUrl.pathname = "/";
    return NextResponse.json({ status: 204 });
  } catch (e) {
    console.log(e);
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return NextResponse.json(
      { error: true, message: message },
      { status: 400 },
    );
  }
};
