"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface ClickableLogoProps {
  url: string;
}

const ClickableLogo: React.FC<ClickableLogoProps> = ({ url }) => {
  const router = useRouter();
  return (
    <Image
      src={"/logo-text.png"}
      alt="RawMats"
      width={400}
      height={400}
      className="hidden md:block"
      onClick={() => router.push(url)}
    />
  );
};

export default ClickableLogo;
