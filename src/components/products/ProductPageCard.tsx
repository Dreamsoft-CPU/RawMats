"use client";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { ProductCardProps } from "@/lib/interfaces/ProductPageProps";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

const ProductPageCard = ({ data }: ProductCardProps) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(
    data.favorites?.some((favorite) => favorite.userId === data.userId) ||
      false,
  );
  const [isLoading, setIsLoading] = useState(false);

  const createConversation = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId: data.supplier.userId }),
      });

      if (response.ok) {
        router.push("/conversations");
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const toggleFavorite = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/product/${data.id}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: data.userId }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update favorite status");
      console.log("Failed to update favorite status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isFavorite, data.id, data.userId, router]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto my-4 md:my-8">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:gap-8">
        {/* Product Image */}
        <div className="relative aspect-square w-full">
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="p-4 md:p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {data.name}
            </h1>
            <button
              onClick={toggleFavorite}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isFavorite ? (
                <HeartIcon className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
              ) : (
                <HeartOutlineIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
              )}
            </button>
          </div>

          <div className="mt-3 md:mt-4">
            <span className="text-2xl md:text-3xl font-bold text-indigo-600">
              ₱{data.price.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 md:mt-6 border-t border-gray-200 pt-3 md:pt-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={data.supplier.businessPicture}
                  alt={data.supplier.businessName}
                />
                <AvatarFallback>
                  {data.supplier.businessName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  {data.supplier.businessName}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(data.supplier.businessLocation)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm text-blue-600 hover:underline"
                >
                  {data.supplier.businessLocation}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-6">
            <h2 className="text-base md:text-lg font-semibold mb-2">
              Description
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {data.description}
            </p>
          </div>

          <div className="mt-auto pt-4 md:pt-6">
            <button
              onClick={() => {
                createConversation();
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-colors"
            >
              Contact Supplier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageCard;
