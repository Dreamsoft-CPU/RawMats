import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DesktopLogin = dynamic(() => import("@/components/login/DesktopLogin"), {
  loading: () => <p>Loading desktop login...</p>,
  ssr: true,
});

const MobileLogin = dynamic(() => import("@/components/login/MobileLogin"), {
  loading: () => <p>Loading mobile login...</p>,
  ssr: true,
});

const LoginPage = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="hidden md:flex w-full h-screen items-center justify-center">
          <DesktopLogin />
        </div>
        <div className="md:hidden w-full h-screen">
          <MobileLogin />
        </div>
      </Suspense>
    </div>
  );
};

export default LoginPage;
