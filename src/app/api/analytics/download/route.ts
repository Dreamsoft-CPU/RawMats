import { NextResponse, type NextRequest } from "next/server";
import { AsyncParser } from "@json2csv/node";
import { object as objectFormatter } from "@json2csv/formatters";
import prisma from "@/utils/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get date range from request
    const { range } = await request.json();

    // Parse date range
    const [startDate, endDate] = range
      .split(",")
      .map((date: string) => new Date(date.trim()));

    // Calculate analytics data
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const suppliers = {
      verified: await prisma.supplier.count({
        where: {
          verified: true,
          verifiedDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      notVerified: await prisma.supplier.count({
        where: {
          verified: false,
          verifiedDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    };

    const products = {
      verified: await prisma.product.count({
        where: {
          verified: true,
          verifiedDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      notVerified: await prisma.product.count({
        where: {
          verified: false,
          verifiedDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    };

    // Get top suppliers by product count
    const topSuppliers = await prisma.supplier.findMany({
      select: {
        businessName: true,
        businessLocation: true,
        _count: {
          select: { Product: true },
        },
      },
      orderBy: {
        Product: {
          _count: "desc",
        },
      },
      take: 5,
    });

    // Format the data
    const data = {
      dateRequested: new Date().toISOString(),
      range,
      newUsers,
      suppliers,
      products,
      topSuppliers: topSuppliers.map((supplier) => ({
        businessName: supplier.businessName,
        productCount: supplier._count.Product,
        businessLocation: supplier.businessLocation,
      })),
    };

    // Format the `range` field
    if (data.range) {
      data.range = data.range.replace(",", " to ");
    }

    // Flatten data into a CSV-friendly format
    const flattenedData = [
      {
        metric: "Date Requested",
        data: data.dateRequested,
      },
      {
        metric: "Selected Date Range",
        data: data.range,
      },
      {
        metric: "New Users",
        data: data.newUsers,
      },
      {
        metric: "Suppliers (Verified)",
        data: data.suppliers.verified,
      },
      {
        metric: "Suppliers (Not Verified)",
        data: data.suppliers.notVerified,
      },
      {
        metric: "Products (Verified)",
        data: data.products.verified,
      },
      {
        metric: "Products (Not Verified)",
        data: data.products?.notVerified,
      },
      ...data.topSuppliers.map((supplier, index) => ({
        metric: `Top Supplier #${index + 1}: ${supplier.businessName}`,
        data: `Products: ${supplier.productCount}, Location: ${supplier.businessLocation}`,
      })),
    ];

    const parser = new AsyncParser({
      formatters: { object: objectFormatter() },
    });
    const csv = await parser.parse(flattenedData).promise();

    const headers = new Headers();
    headers.append("Content-Type", "text/csv");
    headers.append(
      "Content-Disposition",
      `attachment; filename="rawmats_analytics_${new Date().toISOString()}.csv"`,
    );

    return new NextResponse(csv, { status: 200, headers: headers });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
}
