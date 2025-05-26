import { z } from "zod";
import { isPossiblePhoneNumber } from "libphonenumber-js";

export const SupplierRegistrationFormSchema = z.object({
  businessName: z
    .string()
    .min(4, "Business name must be at least 4 characters"),
  businessLocation: z.string(),
  businessPhone: z
    .string()
    .min(4, "Business phone must be at least 4 characters")
    .refine(
      (phone) => {
        try {
          return isPossiblePhoneNumber(phone);
        } catch (e) {
          console.error(e);
          return false;
        }
      },
      { message: "Invalid phone number" },
    ),
  businessDocuments: z
    .array(
      z.instanceof(File).refine(
        (file) => {
          return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
        },
        {
          message: "Only .jpg, .png, and .webp formats are supported.",
        },
      ),
    )
    .min(1, "At least one image is required"),
});

export type SupplierRegistrationFormData = z.infer<
  typeof SupplierRegistrationFormSchema
>;

export const FileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z
    .string()
    .refine(
      (type) => type.startsWith("image/"),
      "Only image files are allowed",
    ),
});

export type FileType = z.infer<typeof FileSchema>;

export const PreviewSchema = z.object({
  url: z.string().url(),
  name: z.string(),
  file: FileSchema,
});

export type PreviewType = z.infer<typeof PreviewSchema>;
