import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { searchClient } from "@algolia/client-search";

const prisma = new PrismaClient();

const client = searchClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY!,
);

export async function POST() {
  try {
    const products = await prisma.product.findMany({
      where: { verified: true },
      include: { supplier: true },
    });

    const records = products.map((product) => ({
      objectID: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      supplierName: product.supplier.businessName,
      supplierLocation: product.supplier.businessLocation,
      dateAdded: product.dateAdded.toISOString(),
      verified: product.verified,
    }));

    const responses = await client.saveObjects({
      indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!,
      objects: records,
    });

    const totalSynced = responses.reduce(
      (sum, batch) => sum + batch.objectIDs.length,
      0,
    );

    return NextResponse.json({
      message: "Products successfully synced to Algolia.",
      syncedRecords: totalSynced,
    });
  } catch (error) {
    console.error("Error syncing products to Algolia:", error);
    return NextResponse.json(
      { error: "Failed to sync products to Algolia." },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
