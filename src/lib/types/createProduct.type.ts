import { z } from "zod";

export const ProductFormDataSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .max(100, "Name must not exceed 100 characters"),
  price: z
    .number()
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01")
    .max(1000000, "Price must not exceed 100000"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  supplierId: z.string(),
  image: z
    .instanceof(File)
    .refine(
      (file) => {
        return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      },
      {
        message: "Only .jpg, .png, and .webp formats are supported.",
      },
    )
    .nullable(),
});

export type ProductFormData = z.infer<typeof ProductFormDataSchema>;
