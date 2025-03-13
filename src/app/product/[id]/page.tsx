import HomeSidebar from "@/components/home/HomeSidebar";
import ProductPageCard from "@/components/products/ProductPageCard";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import { redirect } from "next/navigation";
import React from "react";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message);
  }

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      favorites: {
        select: {
          id: true,
          userId: true,
        },
      },
      supplier: true,
    },
  });

  if (!product) {
    redirect("/error?code=404&message=Product%20not%20found");
  }

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
        <ProductPageCard
          data={{
            id: product.id,
            name: product.name,
            image: product.image,
            description: product.description,
            price: product.price,
            userId: user.id,
            favorites: product.favorites,
            supplier: product.supplier,
          }}
        />
      </HomeInset>
    </div>
  );
};

export default ProductPage;
