import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DesktopSignUp = dynamic(
  () => import("@/components/buyer-signup/DesktopSignUp"),
  {
    loading: () => <p>Loading desktop sign up form...</p>,
    ssr: true,
  },
);

const MobileSignUp = dynamic(
  () => import("@/components/buyer-signup/MobileSignUp"),
  {
    loading: () => <p>Loading mobile sign up form...</p>,
    ssr: true,
  },
);

const BuyerSignUp = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="hidden md:flex w-full h-screen items-center justify-center">
          <DesktopSignUp />
        </div>
        <div className="md:hidden w-full h-screen">
          <MobileSignUp />
        </div>
      </Suspense>
    </div>
  );
};

export default BuyerSignUp;
