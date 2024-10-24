import React from "react";
import LoginForm from "./LoginForm";
import Image from "next/image";
import logo from "../../public/logo.png";

const MobileLogin = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-3/5 items-center justify-center text-center">
        <Image
          src={logo}
          alt="RAWMATS Logo"
          width={400}
          className="max-w-full h-auto mx-auto"
        />
      </div>
      <div className="flex flex-1 bg-white p-6 rounded-t-md shadow-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default MobileLogin;
