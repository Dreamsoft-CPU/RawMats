import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { id, userId } = await request.json();

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        verified: true,
        verifiedDate: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        title: "Product Verified",
        content: `Your product ${product.name} has been verified`,
        userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { id, userId, reason } = await request.json();

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: true, message: "Product not found" },
        { status: 404 },
      );
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    await prisma.notification.create({
      data: {
        title: "Product Rejected",
        content: `Your product ${product.name} has been rejected due to ${reason}. Please make the necessary changes and resubmit.`,
        userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
