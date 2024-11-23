import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/client";
import { revalidatePath } from "next/cache";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.supplier.delete({
      where: {
        userId: params.id,
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}