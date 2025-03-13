import { SendEmailFormData } from "@/lib/types/recover.type";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  try {
    const data: SendEmailFormData = await request.json();

    const { error } = await supabase.auth.resetPasswordForEmail(data.email);

    if (error) {
      throw new Error(error.message);
    }

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
