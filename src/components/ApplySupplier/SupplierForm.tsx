"use client";
import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LocationSelect from "./LocationSelect";
import { uploadFile } from "@/utils/supabase/files";
import InlineLoading from "../Loading/InlineLoading";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  businessDocuments: z.any(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SupplierForm({
  apiKey,
  mapId,
  user,
}: {
  apiKey: string;
  mapId: string;
  user: User;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessAddress: "",
      businessDocuments: undefined,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setSelectedFiles(files);
        const newPreviews = Array.from(files).map((file) =>
          URL.createObjectURL(file),
        );
        setFilePreviews((prevPreviews) => {
          // Clean up old preview URLs
          prevPreviews.forEach(URL.revokeObjectURL);
          return newPreviews;
        });
      }
    },
    [],
  );

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handler for updating the business address
  const handleBusinessAddressChange = (address: string) => {
    form.setValue("businessAddress", address, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: FormValues) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please upload at least one file");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          userID: user.id,
        }),
      });

      await Promise.all(
        Array.from(selectedFiles).map((file) => uploadFile(file, user)),
      );

      const result = await response.json();
      if (!result.success) {
        setError("An error occurred while submitting your application");
        setTimeout(() => {
          setError(null);
        }, 5000);
      } else {
        router.push(
          `/done?header=${encodeURIComponent(
            "Supplier form sent!",
          )}&message=${encodeURIComponent(
            "Kindly wait for your application to be verified",
          )}`,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        router.push(
          `/error?message=${encodeURIComponent(
            error.message,
          )}&code=${encodeURIComponent("500")}`,
        );
      } else {
        router.push(
          `/error?message=${encodeURIComponent(
            "An unexpected error occurred",
          )}&code=${encodeURIComponent("500")}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      filePreviews.forEach(URL.revokeObjectURL);
    };
  }, [filePreviews]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your business name"
                  className="p-5 border border-gray-400 focus:border-[#0A0830] focus:ring focus:ring-[#0A0830] rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Address</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    placeholder="Select your business address"
                    className="flex-1 p-5 border border-gray-400 focus:border-[#0A0830] focus:ring focus:ring-[#0A0830] rounded-xl"
                    readOnly
                    {...field}
                  />
                  <div className="ml-2">
                    <LocationSelect
                      apiKey={apiKey}
                      mapId={mapId}
                      setBusinessAddress={handleBusinessAddressChange}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Business Documents</FormLabel>
          <FormControl>
            <div className="flex items-center border border-gray-400 rounded-xl p-3 bg-white">
              <span className="flex-1 text-gray-500 text-sm">
                {selectedFiles?.length
                  ? `${selectedFiles.length} file(s) selected`
                  : "Choose Files"}
              </span>
              <Button
                type="button"
                onClick={handleFileUploadClick}
                className="bg-rawmats-primary-700 text-white hover:bg-rawmats-primary-500 transition-colors"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </FormControl>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
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
        </FormItem>

        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-rawmats-primary-700 text-white rounded-lg hover:bg-rawmats-primary-300 active:bg-rawmats-primary-700 transition-colors"
          >
            {isLoading ? <InlineLoading message="Signing up" /> : "Sign Up"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
