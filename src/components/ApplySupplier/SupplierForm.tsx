"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LocationSelect from "./LocationSelect";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "@/utils/supabase/files";
import Image from "next/image";
import { FaUpload } from "react-icons/fa";
import { User } from "@supabase/supabase-js";
import InlineLoading from "../Loading/InlineLoading";
import { useRouter } from "next/navigation";

export type ApplicationFormData = {
  businessName: string;
  businessAddress: string;
  businessDocuments: FileList;
};

export default function SupplyForm({
  apiKey,
  mapId,
  user,
}: {
  apiKey: string;
  mapId: string;
  user: User;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ApplicationFormData>();

  const [businessAddress, setBusinessAddress] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [fileCount, setFileCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (businessAddress !== null) {
      setValue("businessAddress", businessAddress);
      trigger("businessAddress");
    }
  }, [businessAddress, setValue, trigger]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setFilePreviews(newPreviews);
      setFileCount(files.length);

      setValue("businessDocuments", files);
      trigger("businessDocuments");
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/supplier", {
        method: "POST",
        body: JSON.stringify({
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          userID: user.id,
        }),
      });

      Array.from(data.businessDocuments).forEach(async (file) => {
        await uploadFile(file, user);
      });

      const result: { success: boolean } = await response.json();

      if (!result.success) {
        setError("An error occurred while submitting your application");
        setTimeout(() => {
          setError(null);
        }, 5000);
      } else {
        router.push(
          `/done?header=${encodeURIComponent("Supplier form sent!")}&message=${encodeURIComponent("Kindly wait for your application to be verified")}`,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        router.push(
          `/error?message=${encodeURIComponent(error.message)}&code=${encodeURIComponent("500")}`,
        );
      } else {
        router.push(
          `/error?message=${encodeURIComponent("An unexpected error occurred")}&code=${encodeURIComponent("500")}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6 font-inter mt-[-0.7rem] m-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="relative mb-8 mt-2">
          {errors.businessName && (
            <p className="absolute left-0 -top-4 text-red-500 text-xs">
              {errors.businessName.message}
            </p>
          )}
          <Input
            type="text"
            id="businessName"
            {...register("businessName", {
              required: "Business name is required",
            })}
            placeholder="Business Name"
            className="w-full p-5 border border-gray-400 focus:border-[#0A0830] focus:ring focus:ring-[#0A0830] rounded-xl"
          />
        </div>

        <div className="flex flex-col mb-8">
          <div className="relative flex items-center">
            {errors.businessAddress && (
              <p className="absolute left-0 -top-4 text-red-500 text-xs">
                {errors.businessAddress.message}
              </p>
            )}
            <Input
              type="text"
              id="address"
              value={businessAddress ?? ""}
              {...register("businessAddress", {
                required: "Business address is required",
              })}
              placeholder="Select your business address"
              className="flex-1 p-5 border border-gray-400 focus:border-[#0A0830] focus:ring focus:ring-[#0A0830] rounded-xl"
              readOnly
            />
            <div className="ml-2">
              <LocationSelect
                apiKey={apiKey}
                mapId={mapId}
                setBusinessAddress={setBusinessAddress}
              />
            </div>
          </div>
        </div>

        <div className="relative mb-8">
          {errors.businessDocuments && (
            <p className="absolute left-0 -top-4 text-red-500 text-xs">
              {errors.businessDocuments.message}
            </p>
          )}
          <div className="flex items-center border border-gray-400 rounded-xl p-1 bg-white">
            <Label
              htmlFor="businessDocuments"
              className="flex-1 ml-2 text-gray-500 text-sm"
            >
              Business Documents
            </Label>

            <Button
              type="button"
              onClick={handleFileUploadClick}
              className="flex items-center bg-gray-200 text-gray-700 hover:bg-gray-300 p-2 text-xs rounded ml-2"
            >
              <FaUpload
                className="mr-1 text-xs ml-auto"
                style={{ fontSize: "0.4rem" }}
              />
              <span className="text-xs">Choose Files</span>
            </Button>
          </div>

          <Input
            type="file"
            accept="image/*"
            multiple
            {...register("businessDocuments", {
              required: "Please upload at least one file",
              validate: {
                checkFileCount: (value) =>
                  (value && value.length > 0) ||
                  "Please upload at least one file",
              },
            })}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="grid grid-cols-3 gap-3 mt-3">
            {filePreviews.map((preview, index) => (
              <Image
                key={index}
                src={preview}
                alt={`Selected file ${index + 1}`}
                width={100}
                height={100}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>

          {fileCount > 0 && (
            <p className="mt-2 text-gray-600">
              {fileCount} file{fileCount > 1 ? "s" : ""} selected.
            </p>
          )}
        </div>

        {error ? (
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-rawmats-feedback-error">{error}</span>
          </div>
        ) : null}

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-1 p-5 w-[45%] px-6 py-2 bg-rawmats-primary-700 text-white rounded-lg hover:bg-rawmats-primary-300 active:bg-rawmats-primary-700 transition-colors"
          >
            {isLoading ? <InlineLoading message="Signing up" /> : "Sign Up"}
          </Button>
        </div>
      </form>
    </div>
  );
}
