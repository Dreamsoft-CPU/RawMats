import { z } from "zod";

export const ProductFormDataSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  price: z.number().positive("Price must be a positive number"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  supplierId: z.string(),
  image: z.instanceof(File).refine(
    (file) => {
      return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    },
    {
      message: "Only .jpg, .png, and .webp formats are supported.",
    },
  ),
});

export type ProductFormData = z.infer<typeof ProductFormDataSchema>;
