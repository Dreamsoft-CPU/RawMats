import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import type { Rating } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  try {
    const ratings = await prisma.rating.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            displayName: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalReviews = ratings.length;
    const averageRating =
      totalReviews > 0
        ? ratings.reduce(
            (sum: number, rating: Rating) => sum + rating.rating,
            0,
          ) / totalReviews
        : 0;

    return NextResponse.json({
      ratings,
      totalReviews,
      averageRating,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getDbUser();

    if ("error" in user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment } = await request.json();

    if (!productId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid product ID or rating" },
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    let newRating;

    if (existingRating) {
      newRating = await prisma.rating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          rating,
          comment,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              displayName: true,
              profilePicture: true,
            },
          },
        },
      });
    } else {
      newRating = await prisma.rating.create({
        data: {
          userId: user.id,
          productId,
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              displayName: true,
              profilePicture: true,
            },
          },
        },
      });
    }

    const allRatings = await prisma.rating.findMany({
      where: { productId },
    });

    const newAverageRating =
      allRatings.reduce((sum: number, r: Rating) => sum + r.rating, 0) /
      allRatings.length;

    return NextResponse.json({
      rating: newRating,
      newAverageRating,
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 },
    );
  }
}
