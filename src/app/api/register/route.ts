import { RegisterFormData } from "@/lib/types/register.type";
import prisma from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  try {
    const data: RegisterFormData = await request.json();

    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (userError || !userData.user) {
      throw new Error(userError?.message);
    }

    const databaseUser = await prisma.user.create({
      data: {
        id: userData.user.id,
        email: data.email,
        displayName: data.displayName,
        phoneNumber: data.phoneNumber,
      },
    });

    return NextResponse.json({ user: databaseUser }, { status: 201 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return NextResponse.json(
      { error: true, message: message },
      { status: 400 },
    );
  }
};
