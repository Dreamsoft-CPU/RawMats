import React from "react";
import DoneScreen from "@/components/AuthComponents/DoneScreen";
import DoneButton from "@/components/AuthComponents/DoneButton";

const DonePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const header =
    typeof searchParams.header === "string"
      ? decodeURIComponent(searchParams.header)
      : "";
  const message =
    typeof searchParams.message === "string"
      ? decodeURIComponent(searchParams.message)
      : "";

  const body = <DoneButton />;

  return <DoneScreen header={header} message={message} body={body} />;
};

export default DonePage;
