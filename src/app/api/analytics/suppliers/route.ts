import prisma from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateRange = searchParams.get("range");

  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (dateRange) {
    const [start, end] = dateRange.split(",");
    if (start && !isNaN(Date.parse(start))) {
      startDate = new Date(start);
    }
    if (end && !isNaN(Date.parse(end))) {
      endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
    }
  }

  try {
    const verified = await prisma.supplier.findMany({
      where: {
        verified: true,
        verifiedDate: {
          gte: startDate || undefined,
          lte: endDate || undefined,
        },
      },
    });

    const notVerified = await prisma.supplier.findMany({
      where: {
        verified: false,
        verifiedDate: {
          gte: startDate || undefined,
          lte: endDate || undefined,
        },
      },
    });

    return NextResponse.json(
      {
        verified: verified.length,
        notVerified: notVerified.length,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
}
