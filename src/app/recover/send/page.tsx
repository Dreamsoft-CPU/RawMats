import { SendRecoveryEmailForm } from "@/components/auth/SendRecoveryEmailForm";
import React from "react";

const SendRecoveryPage = () => {
  return (
    <div className="flex w-full min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SendRecoveryEmailForm />
      </div>
    </div>
  );
};

export default SendRecoveryPage;
