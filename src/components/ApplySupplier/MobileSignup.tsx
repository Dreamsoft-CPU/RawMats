import SupplierForm from "@/components/ApplySupplier/SupplierForm";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

export default function MobileSignup({
  apiKey,
  mapId,
  user,
}: {
  apiKey: string;
  mapId: string;
  user: User;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#CFEEF9]">
      <div className="flex items-center justify-center flex-1 bg-[#CFEEF9]">
        <Image src="/logo.png" alt="RAWMATS Logo" width={300} height={300} />
      </div>
      <div className="bg-white rounded-3xl p-8 shadow-[0_15px_30px_rgba(70,130,180,0.5)] z-10">
        <h2 className="text-[18px] font-extrabold mb-2 text-[#001D3F] font-inter text-center">
          Connect. Collaborate. Succeed.
        </h2>
        <p className="text-sm mt-4 mb-6 text-[#001D3F] text-wider text-center font-inter">
          Your trusted partner in business registration!
        </p>
        <div className="">
          <SupplierForm apiKey={apiKey} mapId={mapId} user={user} />
        </div>
      </div>
    </div>
  );
}
