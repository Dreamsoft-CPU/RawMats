import prisma from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export const GET = async (): Promise<NextResponse> => {
  try {
    const favorites = await prisma.favorite.findMany();

    if (favorites.length === 0) {
      return NextResponse.json({ status: 200 });
    }

    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 400 });
  }
};
