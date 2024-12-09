import prisma from "@/utils/prisma/client";
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
    const newUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate || undefined,
          lt: endDate || undefined,
        },
      },
    });

    return NextResponse.json(newUsers.length, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data. Please try again later.",
      },
      { status: 500 },
    );
  }
}
