import { z } from "zod";
import type { Supplier } from "@prisma/client";

export const ProductFavoriteSchema = z.object({
  id: z.string(),
  userId: z.string(),
});

type ProductFavorite = z.infer<typeof ProductFavoriteSchema>;

export const ProductRatingSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string().nullable(),
  createdAt: z.date(),
  user: z.object({
    displayName: z.string(),
    profilePicture: z.string(),
  }),
});

type ProductRating = z.infer<typeof ProductRatingSchema>;

export const UserRatingSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string().nullable(),
});

type UserRating = z.infer<typeof UserRatingSchema>;

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
    ratings?: ProductRating[];
    averageRating?: number;
    totalReviews?: number;
    userRating?: UserRating | null;
  };
}
