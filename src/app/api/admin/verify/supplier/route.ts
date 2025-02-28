import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { id, userId } = await request.json();

    const supplier = await prisma.supplier.update({
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
        title: "Supplier Verified",
        content: `${supplier.businessName} has been verified. You may now start adding products`,
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

    const supplier = await prisma.supplier.findUnique({
      where: {
        id,
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: true, message: "Supplier not found" },
        { status: 404 },
      );
    }

    await prisma.supplier.delete({
      where: {
        id,
      },
    });

    await prisma.notification.create({
      data: {
        title: "Supplier Rejected",
        content: `${supplier.businessName} has been unverified due to ${reason}. Please make the necessary changes and resubmit.`,
        userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
