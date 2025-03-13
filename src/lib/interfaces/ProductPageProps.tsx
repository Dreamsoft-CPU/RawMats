import { z } from "zod";
import { Supplier } from "@prisma/client";

export const ProductFavoriteSchema = z.object({
  id: z.string(),
  userId: z.string(),
});

type ProductFavorite = z.infer<typeof ProductFavoriteSchema>;

export interface ProductCardProps {
  data: {
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    userId: string;
    favorites: ProductFavorite[];
    supplier: Supplier;
  };
}
