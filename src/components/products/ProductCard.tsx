"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { StarFilledIcon } from "@radix-ui/react-icons";
import type { ProductCardProps } from "@/lib/interfaces/ProductCardProps";
import FavoriteButton from "./FavoriteButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProductCard: React.FC<ProductCardProps> = ({
  data: {
    id,
    name,
    image,
    price,
    supplier,
    favorite,
    userId,
    averageRating,
    totalReviews = 0,
  },
}) => {
  const favorited = favorite.some((fav) => fav.userId === userId);
  const router = useRouter();

  const reviewCount = totalReviews || 0;
  const hasRatings = reviewCount > 0;

  return (
    <Card className="mobile-card w-full border border-blue-950 hover:border-primary card-hover cursor-pointer overflow-hidden">
      <CardHeader className="p-0">
        <div
          onClick={() => router.push(`/product/${id}`)}
          className="mobile-card-image w-full overflow-hidden relative group"
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={500}
            height={500}
            className="rounded-t-xl object-cover w-full h-full object-center group-hover:scale-110 transition-transform duration-300"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
              <FavoriteButton favorite={favorited} id={id} userId={userId} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mobile-card-content flex-1 flex flex-col">
        <div onClick={() => router.push(`/product/${id}`)} className="flex-1">
          <CardTitle className="text-mobile-base font-semibold mb-1 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
            {name}
          </CardTitle>
          <CardDescription className="text-mobile-sm mb-2 line-clamp-1">
            <Link
              href={`/supplier/${supplier.businessName}`}
              className="hover:underline text-blue-600"
              onClick={(e) => e.stopPropagation()}
            >
              {supplier.businessName || "RawMats Supplier"}
            </Link>
          </CardDescription>

          <div className="mb-3">
            <span className="inline-block text-mobile-sm font-bold text-white bg-blue-600 rounded-full px-2 py-1 sm:px-3 sm:py-1">
              ₱{price.toFixed(2)}
            </span>
          </div>
        </div>

        <CardFooter className="p-0 mt-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center gap-1 w-full cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/ratings?productId=${id}`);
                  }}
                >
                  <StarFilledIcon
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      hasRatings ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    {hasRatings ? (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
                        <span className="text-mobile-sm font-medium">
                          {averageRating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-mobile-xs text-blue-950 truncate">
                          ({reviewCount}{" "}
                          {reviewCount === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                    ) : (
                      <span className="text-mobile-xs text-gray-400">
                        No reviews
                      </span>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Feedbacks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </CardContent>

      {/* Mobile-only favorite button */}
      <div className="block sm:hidden absolute top-2 right-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
          <FavoriteButton favorite={favorited} id={id} userId={userId} />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
