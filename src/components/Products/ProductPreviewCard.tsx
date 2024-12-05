"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Star,
  PhilippinePeso,
  Building,
  HeartIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductPreview } from "@/utils/Products";
import { Favorite } from "@prisma/client";

const ProductPreviewCard: React.FC<ProductPreview> = ({
  userId,
  id,
  name,
  supplier,
  price,
}) => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [locationName, setLocationName] = useState<string>("");
  const [favoritedItem, setFavoritedItem] = useState<Favorite | null>(null);

  const handleFavorite = async () => {
    try {
      const response = await fetch(`/api/product/${id}/favorite/${userId}`, {
        method: favoritedItem ? "DELETE" : "POST",
        body: JSON.stringify({ favorite: favoritedItem }),
      });
      const { favorite } = await response.json();
      setFavoritedItem(favorite);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/product/${id}/image`, {
          next: {
            revalidate: 3600,
          },
          cache: "force-cache",
        });
        const data = await response.json();
        setImageUrl(data.signedUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [id]);

  useEffect(() => {
    const fetchFavorite = async () => {
      console.log("fetching favorite", id, userId);
      const favoriteResponse = await fetch(
        `/api/product/${id}/favorite/${userId}`,
      );
      const { favorite } = await favoriteResponse.json();
      console.log(favorite);
      if (favorite) {
        setFavoritedItem(favorite);
      }
    };

    const fetchLocationName = async () => {
      if (supplier.businessLocation.includes("google.com/maps")) {
        try {
          const response = await fetch(`/api/supplier/location`, {
            method: "POST",
            body: JSON.stringify({ locationLink: supplier.businessLocation }),
          });
          const { locationName } = await response.json();
          setLocationName(locationName);
        } catch (error) {
          console.error("Error fetching location name:", error);
          setLocationName(supplier.businessLocation);
        }
      } else {
        setLocationName(supplier.businessLocation);
      }
    };
    fetchLocationName();
    fetchFavorite();
  }, [supplier.businessLocation]);

  const onClickComponent = () => {
    router.push(`/product/${id}`);
  };

  return (
    <Card className="w-full max-w-md overflow-hidden cursor-pointer transition-shadow hover:shadow-md">
      {/* Image Section */}
      <div
        onClick={onClickComponent}
        className="h-48 w-full overflow-hidden bg-gray-100"
      >
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Image
            width={512}
            height={192}
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">
            {name}
            <div className="flex text-gray-500 items-center text-sm mb-2">
              <MapPin strokeWidth={2.5} className="w-4 h-4 mr-1" />
              <span className="truncate">{locationName}</span>
            </div>
          </CardTitle>
          <button
            onClick={handleFavorite}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            {favoritedItem ? (
              <HeartIcon className="w-5 h-5 fill-rawmats-feedback-error text-rawmats-feedback-error" />
            ) : (
              <HeartIcon className="w-5 h-5 text-rawmats-neutral-900" />
            )}
          </button>
        </div>
      </CardHeader>

      <CardContent onClick={onClickComponent} className="p-4 pt-0">
        <div className="flex text-rawmats-primary-300 items-center text-sm mb-2">
          <PhilippinePeso strokeWidth={2.5} className="w-4 h-4 mr-1" />
          <span>{price}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Building className="w-4 h-4 mr-1" />
          <span>{supplier.businessName}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Star className="w-4 h-4 mr-1 text-yellow-500" />
          <span>0.0</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPreviewCard;
