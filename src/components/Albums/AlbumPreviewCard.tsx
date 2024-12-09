"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { DiscAlbum } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlbumPreviewCardProps {
  id: string;
  name: string;
  favorites: Array<{ product: { id: string; name: string } }>;
}

const AlbumPreviewCard: React.FC<AlbumPreviewCardProps> = ({
  id,
  name,
  favorites,
}) => {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  );

  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls: { [key: string]: string } = {};
      const errors: { [key: string]: boolean } = {};
      for (const favorite of favorites.slice(0, 3)) {
        try {
          const response = await fetch(
            `/api/product/${favorite.product.id}/image`,
          );
          if (response.ok) {
            const data = await response.json();
            urls[favorite.product.id] = data.publicUrl;
          } else {
            errors[favorite.product.id] = true;
          }
        } catch (error) {
          console.error(
            `Error fetching image for product ${favorite.product.id}:`,
            error,
          );
          errors[favorite.product.id] = true;
        }
      }
      setImageUrls(urls);
      setImageErrors(errors);
    };

    fetchImageUrls();
  }, [favorites]);

  return (
    <Card className="w-full max-w-md overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-3 gap-2 mb-4 aspect-[3/2]">
          {favorites.slice(0, 3).map(({ product }) => (
            <div
              key={product.id}
              className="relative aspect-square overflow-hidden rounded bg-gray-200"
            >
              {imageUrls[product.id] && !imageErrors[product.id] ? (
                <Image
                  src={imageUrls[product.id]}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  loading="lazy"
                  onError={() =>
                    setImageErrors((prev) => ({ ...prev, [product.id]: true }))
                  }
                />
              ) : (
                <DiscAlbum className="w-8 h-8 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          ))}
          {[...Array(Math.max(0, 3 - favorites.length))].map((_, index) => (
            <div
              key={`empty-${index}`}
              className="flex items-center justify-center aspect-square bg-gray-200 rounded"
            >
              <DiscAlbum className="w-8 h-8 text-gray-400" />
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {favorites.length} item{favorites.length !== 1 ? "s" : ""}
          </span>
          <Button variant="outline" asChild>
            <Link href={`/album/${id}`}>View Album</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlbumPreviewCard;
