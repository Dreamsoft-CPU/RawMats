import { z } from "zod";
import {
  FavoriteSchema,
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
});

export type UserDbData = z.infer<typeof UserToFavoriteSchema>;

export interface UserDataProps {
  userData: UserDbData;
}
