import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

export async function uploadProductImage(file: File, fileName: string) {
  try {
    const { data, error } = await supabase.storage
      .from("photos")
      .upload(`products/${fileName}`, file);

    if (error || !data) {
      throw new Error(error.message);
    }

    const { data: image } = await supabase.storage
      .from("photos")
      .getPublicUrl(data.path);

    return image.publicUrl;
  } catch (error) {
    console.error("Error uploading product image:", error);
    throw error;
  }
}
