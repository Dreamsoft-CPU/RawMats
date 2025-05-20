"use client";

import { ErrorCard } from "@/components/error/ErrorCard";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("message") || "An unexpected error occurred";

  // Limit message length for security and UI consistency
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
