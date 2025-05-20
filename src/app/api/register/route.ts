import { RegisterSchema } from "@/lib/types/register.type";
import prisma from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  try {
    const body = await request.json();
    const data = RegisterSchema.parse(body);

    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (userError || !userData.user) {
      return NextResponse.json(
        { error: true, message: userError?.message || "Failed to create user" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: data.email,
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: true, message: "User with this email already exists" },
        { status: 400 },
      );
    }

    await prisma.user.create({
      data: {
        id: userData.user.id,
        email: data.email,
        displayName: data.displayName,
        phoneNumber: data.phoneNumber,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error("Registration error:", e);
    const message =
      e instanceof Error ? e.message : "An unexpected error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
