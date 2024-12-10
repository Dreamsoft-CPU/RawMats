"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star, Building, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductPreview } from "@/utils/Products";
import { Favorite } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProductPreviewCard: React.FC<ProductPreview> = ({
  userId,
  id,
  name,
  supplier,
  price,
  image,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [locationName, setLocationName] = useState<string>("");
  const [favoritedItem, setFavoritedItem] = useState<Favorite | null>(null);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/product/${id}/favorite/${userId}`, {
        method: favoritedItem ? "DELETE" : "POST",
        body: JSON.stringify({ favorite: favoritedItem }),
      });
      if (!response.ok) throw new Error("Failed to update favorite");
      const { favorite } = await response.json();
      setFavoritedItem(favorite);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  useEffect(() => {
    console.log(image);
    const fetchData = async () => {
      try {
        const [favoriteResponse, locationResponse] = await Promise.all([
          fetch(`/api/product/${id}/favorite/${userId}`),
          fetch(`/api/supplier/location`, {
            method: "POST",
            body: JSON.stringify({ locationLink: supplier.businessLocation }),
          }),
        ]);
        if (!favoriteResponse.ok)
          throw new Error("Failed to fetch favorite status");
        if (!locationResponse.ok) throw new Error("Failed to fetch location");
        const { favorite } = await favoriteResponse.json();
        const { locationName } = await locationResponse.json();
        setFavoritedItem(favorite);
        setLocationName(locationName || supplier.businessLocation);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, userId, supplier.businessLocation, image]);

  const handleCardClick = () => {
    router.push(`/product/${id}`);
  };

  return (
    <Card
      className="w-full max-w-md overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            loading="lazy"
          />
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">
            {name}
            <div className="flex text-gray-500 items-center text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{locationName}</span>
            </div>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${favoritedItem ? "fill-current text-red-500" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary" className="text-rawmats-primary-300">
            ₱{price.toFixed(2)}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            <span>0.0</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Building className="w-4 h-4 mr-1" />
          <span className="truncate">{supplier.businessName}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPreviewCard;
