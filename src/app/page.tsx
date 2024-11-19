"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SignoutButton from "@/components/AuthComponents/SignoutButton";
import prisma from "@/utils/prisma/client";
import ProductCarousel from "@/components/Products/ProductCarousel";
import { ProductWithSupplier } from "@/utils/Products";
import ProductPreviewCard from "@/components/Products/ProductPreviewCard";

const Home = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const products: ProductWithSupplier[] = await prisma.product.findMany({
    include: {
      supplier: true,
    },
  });

  return (
    <div className="min-h-screen bg-rawmats-background-700">
      <header className="bg-rawmats-primary-700 text-rawmats-secondary-100 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome, {data.user.email}</h1>
          <SignoutButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-rawmats-primary-700 mb-8">
            Featured Products
          </h2>
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <ProductCarousel products={products} />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-rawmats-primary-700 mb-8">
            New Arrivals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="transform transition duration-300 hover:scale-105"
              >
                <ProductPreviewCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  supplier={product.supplier}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-rawmats-primary-900 text-rawmats-secondary-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">
            &copy; 2023 RawMats. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
