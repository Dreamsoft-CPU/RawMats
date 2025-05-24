import { ErrorCard } from "@/components/error/ErrorCard";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const message = (await searchParams).message;
  // Limit message length for security and UI consistency

  const errorMessage =
    typeof message === "string" ? message : "An unexpected error occurred";

  const formattedMessage =
    errorMessage.length > 100 ? "An unexpected error occurred" : errorMessage;

  return (
    <div className="flex w-full min-h-svh flex-col items-center justify-center bg-[#F8FBFF] p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <ErrorCard errorMessage={formattedMessage} />
      </div>
    </div>
  );
}
