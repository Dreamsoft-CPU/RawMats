import AlbumAndFavoritesList from "@/components/favorites/AlbumAndFavoritesList";
import HomeSidebar from "@/components/home/HomeSidebar";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

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
          <div>
            No favorites! Click on the hearts on the products to start adding
          </div>
        </HomeInset>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
        <AlbumAndFavoritesList
          albumAndFavoriteData={albumAndFavoriteData}
          userId={user.id}
        />
      </HomeInset>
    </div>
  );
};

export default FavoritesPage;
