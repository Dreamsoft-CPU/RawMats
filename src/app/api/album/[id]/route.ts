import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { favoriteId } = await request.json();
    const { id } = await params;

    const existingFavorite = await prisma.albumFavorite.findFirst({
      where: {
        albumId: id,
        favoriteId: favoriteId,
      },
    });

    if (existingFavorite) {
      throw new Error("This album is already in favorites");
    }

    await prisma.albumFavorite.create({
      data: {
        albumId: id,
        favoriteId: favoriteId,
      },
    });

    revalidatePath(`/api/album/${id}`);
    revalidatePath(`favorites/album/${id}`);

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

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { favoriteId } = await request.json();
    const { id } = await params;

    await prisma.albumFavorite.deleteMany({
      where: {
        albumId: id,
        favoriteId: favoriteId,
      },
    });

    revalidatePath(`/api/album/${id}`);
    revalidatePath(`favorites/album/${id}`);
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
