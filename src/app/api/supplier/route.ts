import { ApplicationFormData } from "@/components/ApplySupplier/SupplierForm";
import prisma from "@/utils/prisma/client";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { z } from "zod";

const SupplierApplicationSchema = z.object({
  businessName: z.string(),
  businessAddress: z.string(),
});

export const POST = async (request: Request) => {
  try {
    const data: ApplicationFormData & { userID: string } = await request.json();

    const result = SupplierApplicationSchema.safeParse({
      businessName: data.businessName,
      businessAddress: data.businessAddress,
    });

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(errorMessage);
    }

    const { businessName, businessAddress } = result.data;

    await prisma.supplier.create({
      data: {
        userId: data.userID,
        businessName: businessName,
        businessLocation: businessAddress,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      redirect(`/error?message=${encodeURIComponent(error.message)}`);
    } else {
      redirect("/error?message=An unexpected error occurred");
    }
  }
};
