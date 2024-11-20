import { createClient, User } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

// Upload file using standard upload
export async function uploadFile(file: File, user: User) {
  const { data, error } = await supabase.storage
    .from("photos")
    .upload(`business-docs/${user.id}/${file.name}`, file, {
      contentType: "image/*",
    });
  if (error) {
    // Handle error
    console.error(error);
  } else {
    // Handle success
    console.log(data);
  }
}

export async function retrieveFile(userID: string) {
  const { data, error } = await supabase.storage
    .from("photos")
    .list(`business-docs/${userID}`, {
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    // Handle error
    console.error(error);
    return null;
  } else {
    // Handle success
    const downloadedFiles = await Promise.all(
      data.map(async (file) => {
        const { data, error } = await supabase.storage
          .from("photos")
          .download(`business-docs/${userID}/${file.name}`);
        if (error) {
          console.error(error);
          return null;
        } else {
          const imageURL = URL.createObjectURL(data);
          return imageURL;
        }
      }),
    );

    return downloadedFiles;
  }
}
