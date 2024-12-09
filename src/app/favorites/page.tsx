import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/client";
import FavoritePreviewCard from "@/components/Favorites/FavoritePreviewCard";
import NavBar from "@/components/Home/NavBar";
import { CreateAlbumDialog } from "@/components/Albums/CreateAlbumDialog";
import AlbumCarousel from "@/components/Albums/AlbumCarousel";

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
    where: { userId: user.id },
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
        {/* Albums Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-rawmats-primary-700">
              Albums
            </h2>
            <CreateAlbumDialog userId={user.id} />
          </div>
          <AlbumCarousel albums={albums} />
        </section>

        {/* Favorites Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-rawmats-primary-700">
              Favorites
            </h2>
          </div>
          {userFavorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {userFavorites.map(({ product }) => (
                <FavoritePreviewCard
                  key={product.id}
                  userId={user.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  supplier={product.supplier}
                  albums={albums}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              {"You haven't added any products to your favorites yet."}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
