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
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
}
