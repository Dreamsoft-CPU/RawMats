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
    <div className="space-y-6 w-full px-mobile-padding sm:px-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-mobile-xl font-bold text-blue-950 mb-2">
          My Collections
        </h1>
        <p className="text-mobile-sm text-gray-600">
          Manage your favorite products and albums
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Albums Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-mobile-lg font-semibold text-blue-950">
                Albums
              </h2>
              <p className="text-mobile-sm text-gray-500 hidden sm:block">
                {albumAndFavoriteData.Album.length} album
                {albumAndFavoriteData.Album.length !== 1 ? "s" : ""}
              </p>
            </div>
            <CreateAlbumForm userId={userId} />
          </div>

          <div className="overflow-x-auto pb-4 -mx-mobile-padding sm:mx-0">
            <div className="flex gap-3 sm:gap-4 px-mobile-padding sm:px-0">
              {albumAndFavoriteData.Album.map((album) => (
                <motion.div
                  key={album.id}
                  whileHover={{ scale: 1.03 }}
                  className="cursor-pointer flex-shrink-0 w-48 sm:w-auto"
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
                <Card className="mobile-card border-dashed border-2 border-gray-300 flex items-center justify-center hover:border-primary hover:bg-accent/50 cursor-pointer transition-colors duration-200">
                  <CardContent className="mobile-card-content flex flex-col items-center justify-center text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <span className="text-mobile-base text-gray-400">
                          +
                        </span>
                      </div>
                      <p className="text-mobile-sm text-muted-foreground">
                        No albums yet
                      </p>
                      <p className="text-mobile-xs text-gray-400">
                        Create your first album!
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <h2 className="text-mobile-lg font-semibold text-blue-950">
                Favorites
              </h2>
              <p className="text-mobile-sm text-gray-500">
                {albumAndFavoriteData.Favorite.length} favorite product
                {albumAndFavoriteData.Favorite.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {paginatedFavorites.length > 0 ? (
            <div className="grid-cards-mobile">
              {paginatedFavorites.map((favorite) => (
                <motion.div
                  key={favorite.id}
                  draggable
                  onDragStart={() => handleDragStart(favorite)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.05, zIndex: 10 }}
                  className="touch-none"
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
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl sm:text-3xl">💝</span>
              </div>
              <h3 className="text-mobile-base font-medium text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-mobile-sm text-gray-500 mb-4">
                Start exploring products and click the heart icon to add them
                here
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="text-mobile-sm"
              >
                Browse Products
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-mobile-sm h-8 px-3"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="text-mobile-sm h-8 w-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="text-mobile-sm h-8 px-3"
                >
                  Next
                </Button>
              </div>

              <div className="text-mobile-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AlbumAndFavoritesList;
