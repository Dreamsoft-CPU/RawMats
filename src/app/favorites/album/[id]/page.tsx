import HomeSidebar from "@/components/home/HomeSidebar";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";
import { redirect } from "next/navigation";
import AlbumProductCard from "@/components/favorites/AlbumProductCard";

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
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{album.name}</h1>
            <p className="text-muted-foreground">
              {album.AlbumFavorite.length} items
            </p>
          </div>

          {album.AlbumFavorite.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {album.AlbumFavorite.map((favorite) => (
                <AlbumProductCard
                  key={favorite.favorite.product.id}
                  data={{
                    id: favorite.favorite.id,
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
            <div className="text-center py-10">
              <p className="text-muted-foreground text-lg">
                No items! Go back to favorites to add some
              </p>
            </div>
          )}
        </div>
      </HomeInset>
    </div>
  );
};

export default AlbumPage;
