import React from "react";
import SignupForm from "@/components/signup/SignupForm";
import Image from "next/image";
import "@/components/signup/styles/DesktopSignup.css";

export default function DesktopSignup({
  apiKey,
  mapId,
}: {
  apiKey: string;
  mapId: string;
}) {
  return (
    <div className="desktop-signup-container min-h-screen flex items-center justify-center">
      <div className="center-box">
        <div className="form-side">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Connect. Collaborate. Succeed!
          </h2>
          <p className="mobile-tagline text-sm mb-6 text-gray-700">
            Process your business registration now!
          </p>
          <SignupForm apiKey={apiKey} mapId={mapId} />
        </div>
        <div className="logo-side">
          <Image
            src="/logo.png"
            alt="Company Logo"
            className="logo"
            width={450}
            height={300}
            layout="intrinsic"
          />
        </div> 
      </div>
    </div>
  );
}
