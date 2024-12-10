import React, { Fragment, Suspense } from "react";
import { notFound } from "next/navigation";
import prisma from "@/utils/prisma/client";
import AlbumProductCard from "@/components/Albums/AlbumProductCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NavBar from "@/components/Home/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import BackToFavorites from "@/components/Albums/BackToFavorites";

const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} />
    ))}
  </div>
);

const EmptyState = () => (
  <Alert variant="default" className="mt-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>No favorites found</AlertTitle>
    <AlertDescription>
      This album is empty. Add some favorites to see them here!
    </AlertDescription>
  </Alert>
);

const AlbumContent = async ({
  albumId,
  userId,
}: {
  albumId: string;
  userId: string;
}) => {
  const album = await prisma.album.findUnique({
    where: { id: albumId },
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

  if (!album) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2">
        <BackToFavorites />
        <h1 className="text-3xl font-bold mb-6">
          Showing favorites from:{" "}
          <span className="text-rawmats-primary-500">{album.name}</span>
        </h1>
      </div>
      {album.favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {album.favorites.map((favorite) => (
            <AlbumProductCard
              key={favorite.id}
              userId={userId}
              id={favorite.product.id}
              name={favorite.product.name}
              supplier={favorite.product.supplier}
              price={favorite.product.price}
              image={favorite.product.image}
              albumId={album.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AlbumPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userData.user.id },
    include: { supplier: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <Fragment>
      <NavBar user={user} supplier={user.supplier} />
      <Suspense fallback={<LoadingState />}>
        <AlbumContent albumId={params.id} userId={user.id} />
      </Suspense>
    </Fragment>
  );
};

export default AlbumPage;
