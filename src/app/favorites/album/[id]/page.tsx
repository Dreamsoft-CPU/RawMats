import HomeSidebar from "@/components/home/HomeSidebar";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";
import { redirect } from "next/navigation";
import AlbumProductCard from "@/components/favorites/AlbumProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AlbumPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message);
  }

  const album = await prisma.album.findUnique({
    where: {
      id,
    },
    include: {
      AlbumFavorite: {
        include: {
          favorite: {
            include: {
              product: {
                include: {
                  supplier: true,
                  favorites: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!album) {
    redirect("/error?code=404&message=Album%20not%20found");
  }

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
        <div className="h-full overflow-y-auto">
          <div className="w-full px-mobile-padding sm:px-0">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-mobile-xl font-bold text-blue-950 mb-1">
                    {album.name}
                  </h1>
                  <p className="text-mobile-sm text-gray-500">
                    {album.AlbumFavorite.length} item
                    {album.AlbumFavorite.length !== 1 ? "s" : ""} in this album
                  </p>
                </div>
                <Link href="/favorites">
                  <Button
                    variant="outline"
                    className="text-mobile-sm w-full sm:w-auto"
                  >
                    ← Back to Collections
                  </Button>
                </Link>
              </div>
            </div>

            {album.AlbumFavorite.length > 0 ? (
              <div className="grid-cards-mobile">
                {album.AlbumFavorite.map((favorite) => (
                  <AlbumProductCard
                    key={favorite.favorite.product.id}
                    data={{
                      id: favorite.favorite.product.id,
                      name: favorite.favorite.product.name,
                      image: favorite.favorite.product.image,
                      price: favorite.favorite.product.price,
                      userId: favorite.id,
                      albumId: album.id,
                      supplier: favorite.favorite.product.supplier,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl sm:text-3xl">📁</span>
                </div>
                <h3 className="text-mobile-base font-medium text-gray-900 mb-2">
                  Empty album
                </h3>
                <p className="text-mobile-sm text-gray-500 mb-6 max-w-md mx-auto">
                  {
                    "This album doesn't have any products yet. Go back to your favorites and drag items here, or use the 'Add to Album' option."
                  }
                </p>
                <div className="space-y-3">
                  <Link href="/favorites">
                    <Button className="text-mobile-sm w-full sm:w-auto">
                      Go to Favorites
                    </Button>
                  </Link>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="text-mobile-sm w-full sm:w-auto"
                      >
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </HomeInset>
    </div>
  );
};

export default AlbumPage;
