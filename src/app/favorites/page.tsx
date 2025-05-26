import AlbumAndFavoritesList from "@/components/favorites/AlbumAndFavoritesList";
import HomeSidebar from "@/components/home/HomeSidebar";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import { Button } from "@/components/ui/button";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";
import Link from "next/link";

const FavoritesPage = async () => {
  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message);
  }

  const albumAndFavoriteData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      Album: {
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
      },
      Favorite: {
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
  });

  if (!albumAndFavoriteData) {
    return (
      <div className="flex h-screen w-full">
        <HomeSidebar data={sidebarData} />
        <HomeInset userData={user}>
          <div className="flex flex-col items-center justify-center h-full px-mobile-padding sm:px-0">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl sm:text-4xl">💝</span>
              </div>
              <h2 className="text-mobile-lg font-semibold text-gray-900 mb-3">
                No favorites yet
              </h2>
              <p className="text-mobile-sm text-gray-500 mb-6">
                Start exploring our products and click on the hearts to add them
                to your favorites collection.
              </p>
              <div className="space-y-3">
                <Link href="/">
                  <Button className="w-full sm:w-auto text-mobile-sm">
                    Browse Products
                  </Button>
                </Link>
                <p className="text-mobile-xs text-gray-400">
                  Create albums to organize your favorites better
                </p>
              </div>
            </div>
          </div>
        </HomeInset>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
        <div className="h-full overflow-y-auto">
          <AlbumAndFavoritesList
            albumAndFavoriteData={albumAndFavoriteData}
            userId={user.id}
          />
        </div>
      </HomeInset>
    </div>
  );
};

export default FavoritesPage;
