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
    const topSuppliers = await prisma.product.groupBy({
      by: "supplierId",
      where: {
        verified: true,
        verifiedDate: {
          gte: startDate || undefined,
          lte: endDate || undefined,
        },
      },
      _count: {
        supplierId: true,
      },
      orderBy: {
        _count: {
          supplierId: "desc",
        },
      },
      take: 5,
    });

    const supplierInfo = await prisma.supplier.findMany({
      where: {
        id: {
          in: topSuppliers.map((product) => product.supplierId),
        },
      },
    });

    const results = topSuppliers.map((supplier) => ({
      productCount: supplier._count.supplierId,
      businessName: supplierInfo.find((s) => s.id === supplier.supplierId)
        ?.businessName,
      businessLocation: supplierInfo.find((s) => s.id === supplier.supplierId)
        ?.businessLocation,
    }));

    return NextResponse.json(results, { status: 200 });
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
