import React from "react";
import SignupForm from "@/components/signup/SignupForm";
import Image from "next/image";

export default function DesktopSignup({
  apiKey,
  mapId,
}: {
  apiKey: string;
  mapId: string;
}) {   
  return (
    <div className="bg-[rgba(254,254,254,0.962)] min-h-screen flex items-center justify-center">
      <div className="w-[80%] lg:w-[70%] flex rounded-xl overflow-hidden m-12 h-[75%] shadow-[0_15px_30px_rgba(70,130,180,0.5)]"> 
        <div className="w-[60%] p-12 bg-white"> 
          <h2 className="text-[20px] font-extrabold mb-3 text-[#001D3F]">
            Connect. Collaborate. Succeed.
          </h2>
          <p className="text-sm mb-6 text-[#001D3F] text-wide">
          Your trusted partner in business registration!
          </p>
          <SignupForm apiKey={apiKey} mapId={mapId} />
        </div>
        
        <div className="w-[60%] bg-[#CFEEF9] flex items-center justify-center p-4">
          <Image
            src="/logo.png"
            alt="RAWMATS Logo"
            width={450}
            height={300}
            layout="intrinsic"
          />
        </div>
        
      </div>
    </div>
  );
} 