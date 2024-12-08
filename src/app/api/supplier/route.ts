import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/utils/prisma/client";

const SupplierApplicationSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  userID: z.string().min(1, "User ID is required"),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = SupplierApplicationSchema.safeParse(data);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 },
      );
    }

    const { businessName, businessAddress, userID } = result.data;

    await prisma.supplier.create({
      data: {
        userId: userID,
        businessName: businessName,
        businessLocation: businessAddress,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
