import { NextResponse } from "next/server";
import prisma from "@/utils/prisma/client";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; productId: string }> },
) {
  try {
    const { id, productId } = await params;

    // Remove the favorite from the album
    await prisma.album.update({
      where: { id: id },
      data: {
        favorites: {
          disconnect: {
            id: await prisma.favorite
              .findFirst({
                where: {
                  productId: productId,
                  albums: {
                    some: {
                      id: id,
                    },
                  },
                },
              })
              .then((favorite) => favorite?.id),
          },
        },
      },
    });

    return NextResponse.json({
      message: "Product removed from album successfully",
    });
  } catch (error) {
    console.error("Error removing product from album:", error);
    return NextResponse.json(
      { error: "Failed to remove product from album" },
      { status: 500 },
    );
  }
}
