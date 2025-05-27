import { z } from "zod";
import {
  FavoriteSchema,
  NotificationSchema,
  ProductSchema,
  SupplierSchema,
  UserSchema,
} from "../types/userToFavorite.type";

// Add Rating schema
export const RatingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  rating: z.number(),
  comment: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserToFavoriteSchema = UserSchema.extend({
  Supplier: z.array(
    SupplierSchema.extend({
      Product: z.array(
        ProductSchema.extend({
          favorites: z.array(FavoriteSchema),
          ratings: z.array(RatingSchema),
        }),
      ),
    }),
  ),
  Notification: z.array(NotificationSchema),
});

export type UserDbData = z.infer<typeof UserToFavoriteSchema>;

export interface UserDataProps {
  userData: UserDbData;
}
