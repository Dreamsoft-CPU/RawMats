import React from "react";
import BuyerAttributeFields from "./BuyerAttributeFields";
import Image from "next/image";
import logo from "../../public/logo.png";

const MobileSignUp = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-3/5 items-center justify-center text-center bg-rawmats-secondary-300">
        <Image
          src={logo}
          alt="RAWMATS Logo"
          width={400}
          className="max-w-full h-auto mx-auto"
        />
      </div>
      <div className="flex flex-1 bg-white rounded-t-md shadow-md">
        <BuyerAttributeFields />
      </div>
    </div>
  );
};

export default MobileSignUp;
