import { NextResponse } from "next/server";
import prisma from "@/utils/prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId, productId } = await request.json();
  const { id } = await params;

  try {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 },
      );
    }

    const updatedAlbum = await prisma.album.update({
      where: { id: id },
      data: {
        favorites: {
          connect: { id: favorite.id },
        },
      },
    });

    return NextResponse.json({ success: true, album: updatedAlbum });
  } catch (error) {
    console.error("Error adding favorite to album:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
