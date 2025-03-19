import HomeSidebar from "@/components/home/HomeSidebar";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import RatingsInfo from "@/components/ratings/RatingsInfo";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import { redirect } from "next/navigation";
import React from "react";

const RatingsPage = async ({
  searchParams,
}: {
  searchParams: { productId?: string };
}) => {
  const productId = searchParams?.productId;

  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message);
  }

  if (!productId) {
    redirect("/error?code=400&message=Missing%20product%20ID");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      supplier: true,
    },
  });

  if (!product) {
    redirect("/error?code=404&message=Product%20not%20found");
  }

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <div className="flex-grow h-full">
        <HomeInset userData={user}>
          <div className="h-full w-full">
            <RatingsInfo />
          </div>
        </HomeInset>
      </div>
    </div>
  );
};

export default RatingsPage;
