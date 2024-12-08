import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/client";
import ProductPreviewCard from "@/components/Products/ProductPreviewCard";
import NavBar from "@/components/Home/NavBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  // Supabase Auth
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  // Fetch User Details
  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
    include: { supplier: true },
  });

  if (!user) {
    redirect("/login");
  }

  const userFavorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          supplier: true,
        },
      },
    },
  });

  const albums = await prisma.album.findMany({
    where: { favorites: { some: { userId: user.id } } },
    include: {
      favorites: {
        include: {
          product: {
            include: {
              supplier: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="min-h-screen">
      <NavBar user={user} supplier={user.supplier} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Favorites Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-rawmats-primary-700">
              Favorites
            </h2>
            <Link href="/create-album">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Create Album
              </Button>
            </Link>
          </div>
          {userFavorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {userFavorites.map(({ product }) => (
                <ProductPreviewCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  supplier={product.supplier}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              You havent added any products to your favorites yet.
            </p>
          )}
        </section>

        {/* Albums Section */}
        <section>
          <h2 className="text-2xl font-bold text-rawmats-primary-700 mb-6">
            My Albums
          </h2>
          {albums.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-4">{album.name}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {album.favorites.slice(0, 6).map(({ product }) => (
                      <div
                        key={product.id}
                        className="aspect-square overflow-hidden rounded"
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
                  <Link
                    href={`/album/${album.id}`}
                    className="mt-4 block text-sm text-blue-600 hover:underline"
                  >
                    View Album
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You havent created any albums yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}
