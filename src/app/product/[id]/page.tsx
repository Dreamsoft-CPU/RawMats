import ProductInformationCard from "@/components/Products/ProductInformationCard";
import prisma from "@/utils/prisma/client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

const ProductPage = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: data.user.id,
    },
  });

  console.log(user);

  if (!user) {
    redirect("/login");
  }
  return (
    <div>
      <ProductInformationCard userId={user.id} />
    </div>
  );
};

export default ProductPage;
