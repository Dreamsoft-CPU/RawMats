"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { DiscAlbum } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlbumPreviewCardProps {
  id: string;
  name: string;
  favorites: Array<{ product: { id: string; name: string; image: string } }>;
}

const AlbumPreviewCard: React.FC<AlbumPreviewCardProps> = ({
  id,
  name,
  favorites,
}) => {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  );

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
              {!imageErrors[product.id] ? (
                <Image
                  src={product.image}
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
          <div>
            <Link href={`/album/${id}`}>
              <Button variant="outline" asChild>
                <h1>View Album</h1>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlbumPreviewCard;
