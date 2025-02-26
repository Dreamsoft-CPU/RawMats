import { z } from "zod";
import {
  FavoriteSchema,
  NotificationSchema,
  ProductSchema,
  SupplierSchema,
  UserSchema,
} from "../types/userToFavorite.type";

export const UserToFavoriteSchema = UserSchema.extend({
  Supplier: z.array(
    SupplierSchema.extend({
      Product: z.array(
        ProductSchema.extend({
          favorites: z.array(FavoriteSchema),
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
