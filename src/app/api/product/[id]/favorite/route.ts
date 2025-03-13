import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        productId: id,
        userId,
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      return NextResponse.json({ status: 204 });
    } else {
      await prisma.favorite.create({
        data: {
          productId: id,
          userId,
        },
      });

      return NextResponse.json({ status: 204 });
    }
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return NextResponse.json(
      { error: true, message: message },
      { status: 400 },
    );
  }
};
