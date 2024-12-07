import prisma from "@/utils/prisma/client";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; userId: string }>;
  },
): Promise<NextResponse> => {
  try {
    const { userId, id } = await params;

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: userId,
        productId: id,
      },
    });

    console.log(favorite);

    return NextResponse.json({ favorite }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
};

export const POST = async (
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; userId: string }>;
  },
): Promise<NextResponse> => {
  try {
    const { userId, id } = await params;

    const favorite = await prisma.favorite.create({
      data: {
        productId: id,
        userId: userId,
      },
    });

    return NextResponse.json({ favorite }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 400 });
  }
};

export const DELETE = async (
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; userId: string }>;
  },
): Promise<NextResponse> => {
  try {
    const { userId, id } = await params;

    await prisma.favorite.deleteMany({
      where: {
        userId: userId,
        productId: id,
      },
    });

    return NextResponse.json({ favorite: null }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 400 });
  }
};
