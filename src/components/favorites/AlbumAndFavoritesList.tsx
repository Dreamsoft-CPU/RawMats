"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AlbumAndFavoritesListProps } from "./albumTypes.type";
import { Favorite } from "./albumTypes.type";
import AlbumCard from "./AlbumCard";

import CreateAlbumForm from "./CreateAlbumForm";
import { useRouter } from "next/navigation";
import FavoriteProductCard from "./FavoriteProductCard";

const AlbumAndFavoritesList: React.FC<AlbumAndFavoritesListProps> = ({
  albumAndFavoriteData,
  userId,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [draggingFavorite, setDraggingFavorite] =
    useState<Partial<Favorite> | null>(null);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(
    albumAndFavoriteData.Favorite.length / itemsPerPage,
  );
  const paginatedFavorites = albumAndFavoriteData.Favorite.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDragStart = (favorite: Favorite) => {
    setDraggingFavorite(favorite);
  };

  const handleDragEnd = () => {
    setDraggingFavorite(null);
  };

  const handleDropToAlbum = async (albumId: string) => {
    if (!draggingFavorite) return;

    try {
      const response = await fetch(`/api/album/${albumId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favoriteId: draggingFavorite.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to add to album:", error.message);
      }

      router.refresh();

      // You might want to refresh data here or use optimistic updates
    } catch (error) {
      console.error("Error adding to album:", error);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-bold">My Collections</h1>

      <div className="space-y-8">
        {/* Albums Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Albums</h2>
            <CreateAlbumForm userId={userId} />
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4">
              {albumAndFavoriteData.Album.map((album) => (
                <motion.div
                  key={album.id}
                  whileHover={{ scale: 1.03 }}
                  className="cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggingFavorite) {
                      handleDropToAlbum(album.id);
                    }
                  }}
                >
                  <AlbumCard album={album} />
                </motion.div>
              ))}

              {/* Create Album Card */}
              {albumAndFavoriteData.Album.length === 0 && (
                <Card className="min-w-[200px] max-w-[250px] border-dashed flex items-center justify-center hover:bg-accent/50 cursor-pointer">
                  <CardContent className="py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-muted-foreground">
                        No albums... Create a new one!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Favorites Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Favorites</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedFavorites.map((favorite) => (
              <motion.div
                key={favorite.id}
                draggable
                onDragStart={() => handleDragStart(favorite)}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.05, zIndex: 10 }}
              >
                <FavoriteProductCard
                  id={favorite.product.id}
                  favoriteId={favorite.id}
                  name={favorite.product.name}
                  image={favorite.product.image}
                  price={favorite.product.price}
                  supplier={favorite.product.supplier.businessName}
                  albums={albumAndFavoriteData.Album}
                />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AlbumAndFavoritesList;
