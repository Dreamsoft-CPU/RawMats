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
    <Card className="w-full max-w-52 h-[420px] hover:border-primary transition-transform duration-200 hover:scale-105">
      <CardHeader className="p-0">
        <div
          onClick={() => router.push(`/product/${id}`)}
          className="w-full h-52 overflow-hidden"
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={500}
            height={500}
            className="rounded-t-xl object-cover w-full h-full object-center"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="p-4">
          <CardTitle className="truncate flex flex-row justify-between text-lg items-center">
            {name}{" "}
            <FavoriteButton favorite={favorited} id={id} userId={userId} />
          </CardTitle>
          <CardDescription className="truncate">
            {supplier.businessName || "RawMats Supplier"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent onClick={() => router.push(`/product/${id}`)}>
        <p className="text-primary font-bold text-lg">₱{price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <p
          className="flex flex-row items-center gap-1 cursor-pointer"
          onClick={() => router.push(`/ratings?productId=${id}`)}
        >
          <StarFilledIcon
            className={hasRatings ? "text-yellow-400" : "text-gray-300"}
          />
          {hasRatings
            ? `${averageRating?.toFixed(1) || "0.0"}`
            : "No ratings yet"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
