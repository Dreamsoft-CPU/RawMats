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
    <div
      className="hidden md:block hover:cursor-pointer  hover:scale-105 transition-transform duration-200 w-[100-px] h-20 overflow-hidden"
      onClick={() => router.push(url)}
    >
      <Image
        src={"/logo-text.png"}
        alt="RawMats"
        width={400}
        height={200}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default ClickableLogo;
