import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/client";
import { ProductWithSupplier } from "@/utils/Products";
import ProductPreviewCard from "@/components/Products/ProductPreviewCard";
import NavBar from "@/components/Home/NavBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCarousel from "@/components/Products/ProductCarousel";

const ITEMS_PER_PAGE = 12;

export default async function Home({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const page = Number(searchParams.page) || 1;
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userData.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  const supplier = await prisma.supplier.findUnique({
    where: { userId: user.id },
  });

  const allProducts: ProductWithSupplier[] = await prisma.product.findMany({
    include: { supplier: true },
    orderBy: { dateAdded: "desc" },
  });

  const dailyDiscoverProducts = allProducts.slice(0, 8);
  const newArrivalsProducts = allProducts.slice(0, 4);
  const paginatedProducts = allProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rawmats-background-700 to-rawmats-secondary-100">
      <NavBar user={user} supplier={supplier} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-rawmats-primary-700 mb-6">
            Daily Discover
          </h2>
          <ProductCarousel userId={user.id} products={dailyDiscoverProducts} />
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-rawmats-primary-700 mb-6">
            New Arrivals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivalsProducts.map((product) => (
              <ProductPreviewCard
                key={product.id}
                userId={user.id}
                id={product.id}
                name={product.name}
                price={product.price}
                supplier={product.supplier}
              />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-rawmats-primary-700 mb-6">
            Browse All
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedProducts.map((product) => (
              <ProductPreviewCard
                key={product.id}
                userId={user.id}
                id={product.id}
                name={product.name}
                price={product.price}
                supplier={product.supplier}
              />
            ))}
          </div>
          <div className="flex justify-center items-center gap-4">
            <Button variant="outline" disabled={page <= 1} asChild>
              <Link href={`/?page=${Math.max(1, page - 1)}`}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Link>
            </Button>
            <span className="text-rawmats-text-700">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" disabled={page >= totalPages} asChild>
              <Link href={`/?page=${Math.min(totalPages, page + 1)}`}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="bg-rawmats-primary-900 text-rawmats-secondary-100 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            &copy; 2023 RawMats. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
