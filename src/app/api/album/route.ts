import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { userId, name, description } = await request.json();

    const album = await prisma.album.create({
      data: {
        name,
        description,
        userId,
      },
    });

    revalidatePath("/api/album");
    revalidatePath("/favorites");
    return NextResponse.json({ album }, { status: 201 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return NextResponse.json(
      { error: true, message: message },
      { status: 400 },
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { id } = await request.json();

    await prisma.album.delete({
      where: {
        id,
      },
    });

    revalidatePath("/api/album");
    revalidatePath("/favorites");
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
