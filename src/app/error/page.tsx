import React from "react";
import ErrorPage from "@/components/Error/ErrorPage";

const Error = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const messageArray = (await searchParams).message;
  const codeArray = (await searchParams).code;
  const message = Array.isArray(messageArray)
    ? messageArray[0]
    : messageArray || "An unexpected error occurred";
  const code = Array.isArray(codeArray) ? codeArray[0] : codeArray || "500";

  return <ErrorPage errorMessage={message} errorCode={code} />;
};

export default Error;
