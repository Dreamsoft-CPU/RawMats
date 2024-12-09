import { NextResponse, type NextRequest } from "next/server";
import { AsyncParser } from "@json2csv/node";
import { object as objectFormatter } from "@json2csv/formatters";

export async function POST(request: NextRequest) {
  const data: {
    dateRequested: string;
    range: string;
    newUsers: number;
    suppliers: {
      verified: number;
      notVerified: number;
    };
    products: {
      verified: number;
      notVerified: number;
    };
    topSuppliers: {
      businessName: string;
      productCount: number;
      businessLocation: string;
    }[];
  } = await request.json();

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

  const parser = new AsyncParser({ formatters: { object: objectFormatter() } });
  const csv = await parser.parse(flattenedData).promise();

  const headers = new Headers();
  headers.append("Content-Type", "text/csv");
  headers.append(
    "Content-Disposition",
    `attachment; filename="rawmats_analytics_${new Date().toISOString()}.csv"`,
  );

  return new NextResponse(csv, { status: 200, headers: headers });
}
