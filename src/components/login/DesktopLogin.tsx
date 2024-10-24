import React from "react";
import LoginForm from "./LoginForm";
import Image from "next/image";
import logo from "../../public/logo.png";

const DesktopLogin = () => {
  return (
    <div className="max-w-6xl m-4 w-full h-3/4 flex items-center justify-center bg-white rounded-2xl shadow-xl shadow-rawmats-secondary-700 overflow-hidden">
      <div className="flex flex-col justify-center gap-4 items-start w-3/4 p-12">
        <h2 className="text-5xl font-bold mb-2 text-rawmats-text-700">
          Ready to Dive In?
        </h2>
        <p className="text-rawmats-text-500 mb-8">Login to your account!</p>
        <LoginForm />
      </div>
      <div className="w-1/2 h-full bg-rawmats-secondary-100 p-12 flex items-center justify-center">
        <Image
          src={logo}
          alt="RAWMATS Logo"
          width={400}
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default DesktopLogin;
