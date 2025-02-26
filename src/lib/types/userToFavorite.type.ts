import { Role } from "@prisma/client";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  profilePicture: z.string().default("/users/default.jpg"),
  phoneNumber: z.string().default("None"),
  role: z.nativeEnum(Role).default("USER"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SupplierSchema = z.object({
  id: z.string(),
  userId: z.string(),
  businessPicture: z.string().default("/businesses/default.jpg"),
  businessName: z.string(),
  businessLocation: z.string(),
  businessPhone: z.string().default("None"),
  businessDocuments: z.array(z.string()),
  bio: z.string().default("None"),
  verified: z.boolean().default(false),
  verifiedDate: z.date(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string().default("/products/default.jpg"),
  price: z.number(),
  supplierId: z.string(),
  dateAdded: z.date(),
  verified: z.boolean().default(false),
  verifiedDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const FavoriteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  createdAt: z.date(),
});

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  read: z.boolean().default(false),
  createdAt: z.date(),
});
