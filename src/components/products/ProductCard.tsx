"use client";
import React from "react";
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
import { ProductCardProps } from "@/lib/interfaces/ProductCardProps";
import FavoriteButton from "./FavoriteButton";
import { useRouter } from "next/navigation";

const ProductCard: React.FC<ProductCardProps> = ({
  data: { id, name, image, price, supplier, favorite, userId },
}) => {
  const favorited = favorite.some((fav) => fav.userId === userId);
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/product/${id}`)}
      className="max-w-52 hover:border-primary transition-transform duration-200 hover:scale-105"
    >
      <CardHeader>
        <div className="-mx-6 -mt-6 aspect-square">
          <Image
            src={image}
            alt="Product"
            width={500}
            height={500}
            className="rounded-t-xl object-cover w-full h-full"
          />
        </div>
        <CardTitle className="truncate flex flex-row justify-between text-lg -mx-4 items-center ">
          {name} <FavoriteButton favorite={favorited} id={id} userId={userId} />
        </CardTitle>
        <CardDescription className="-mx-4">
          {supplier.businessName || "RawMats Supplier"}
        </CardDescription>
      </CardHeader>
      <CardContent className="-mt-4 -mx-4">
        <p className="text-primary font-bold text-lg">₱{price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="-mx-4">
        <p className="flex flex-row items-center gap-1">
          <StarFilledIcon className="text-yellow-300" />
          5.0
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
