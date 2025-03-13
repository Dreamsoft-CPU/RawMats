import { z } from "zod";

export const EditProductFormDataSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  supplierId: z.string().optional(),
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
    .optional(),
});

export type EditProductFormData = z.infer<typeof EditProductFormDataSchema>;
