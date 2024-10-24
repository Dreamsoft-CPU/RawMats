import SignupForm from "@/components/signup/SignupForm";
import Image from "next/image";


export default function MobileSignup({
  apiKey,
  mapId,
}: {
  apiKey: string;
  mapId: string;
}) {
  return (
    <div className="mobile-signup-container min-h-screen flex flex-col bg-[#CFEEF9]">
      <div className="mobile-signup-logo flex items-center justify-center flex-1">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={300}
          height={200}
        />
      </div>

      <div className="mobile-signup-form bg-white rounded-t-[2rem] p-8 shadow-lg z-10">
        <h2 className="text-center text-lg font-bold mb-2">
          Connect. Collaborate. Succeed.
        </h2>
        <p className="text-center text-sm mb-4">
          Process your business registration now!
        </p>
        <SignupForm apiKey={apiKey} mapId={mapId} />
      </div>
    </div>
  );
}


