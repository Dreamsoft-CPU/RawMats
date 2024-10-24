"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import LocationSelect from "./LocationSelect";
import { useState } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline"; 
import "@/components/signup/styles/SignupForm.css";

type FormData = {
  businessName: string;
  contactNumber: string;
  businessDocuments?: string; 
};

export default function SignupForm({
  apiKey,
  mapId,
}: {
  apiKey: string;
  mapId: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [businessAddress, setBusinessAddress] = useState<null | string>(null);

  const onSubmit = (data: FormData) => {
    console.log("Signup attempt with:", data);
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <Input
            type="text"
            id="businessName"
            {...register("businessName")}
            placeholder="Business Name"
            className="signup-input"
          />
          {errors.businessName && (
            <p className="signup-error">{errors.businessName?.message}</p>
          )}
        </div>

        <div>
          <Input
            type="text"
            id="contactNumber"
            {...register("contactNumber")}
            placeholder="Contact Number"
            className="signup-input"
          />
          {errors.contactNumber && (
            <p className="signup-error">{errors.contactNumber?.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start">
            <div className="flex-1">
              <Input
                type="text"
                id="address"
                value={businessAddress ?? ""}
                placeholder="Select your business address"
                className="signup-input"
                readOnly
              />
            </div>
            <div className="ml-3">
              <LocationSelect
                apiKey={apiKey}
                mapId={mapId}
                setBusinessAddress={setBusinessAddress}
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <Input
            type="text"
            id="businessDocuments"
            {...register("businessDocuments")}
            placeholder="Business Documents (Optional)"
            className="signup-input business-documents-input pl-10"
            readOnly
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 bg-transparent"
            onClick={() => {
              console.log("Upload document button clicked");
            }}
          >
            <PaperClipIcon className="h-5 w-5 text-black" aria-hidden="true" />
          </button>
        </div>
        {errors.businessDocuments && (
          <p className="signup-error">{errors.businessDocuments?.message}</p>
        )}

        <div>
          <button
            type="submit"
            className="signup-button"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
