import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { id, userID } = await request.json();

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
        userId: userID,
      },
    });

    revalidatePath("/api/admin/verify/item");
    revalidatePath("/admin/products");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { id, userId, reasons, comment } = await request.json();

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
        content: `Your product ${product.name} has been rejected.
        Reasons for rejection:
        ${reasons.join(", ")}
        Additional comments: 
        ${comment}`,
        userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.log(e);
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
