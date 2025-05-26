import { LoginForm } from "@/components/auth/LoginForm";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex w-full min-h-svh flex-col items-center justify-center bg-[#F8FBFF] p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
