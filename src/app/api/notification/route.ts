import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    const { ids } = await req.json();

    if (!ids) {
      throw new Error("No notification IDs provided");
    }

    await prisma.notification.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ status: 204 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
