import { ResetPasswordFormData } from "@/lib/types/recover.type";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  try {
    const data: ResetPasswordFormData = await request.json();

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ status: 204 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return NextResponse.json(
      { error: true, message: message },
      { status: 400 },
    );
  }
};
