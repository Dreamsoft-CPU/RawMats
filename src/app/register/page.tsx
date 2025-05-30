import { RegisterForm } from "@/components/auth/RegisterForm";
import React from "react";

const RegisterPage = () => {
  return (
    <div className="flex w-full min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
