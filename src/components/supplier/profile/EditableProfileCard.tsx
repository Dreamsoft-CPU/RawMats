"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUp, Loader, Pencil, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ImageCropper from "@/components/images/ImageCropper";
import { toast } from "sonner";
import { UserDataProps } from "@/lib/interfaces/ProductListProps";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";

const phoneSchema = z.object({
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

const EditableProfileCard: React.FC<UserDataProps> = ({ userData }) => {
  const supplier = userData.Supplier[0]; // Assuming we're showing the first supplier
  const [bio, setBio] = useState(supplier?.bio || "");
  const [phone, setPhone] = useState(supplier?.businessPhone || "");
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: supplier.businessPhone,
    },
  });

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Opens file picker
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setCropImage(e.target.result);
          setShowCropper(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImage: Blob) => {
    try {
      setShowCropper(false);
      setLoading(true);
      setError(null);

      // Create a FormData object and add the cropped image
      const formData = new FormData();
      formData.append(
        "businessPicture",
        new File([croppedImage], "profile.jpg", { type: "image/jpeg" }),
      );

      // Send the image directly to the supplier API endpoint
      const response = await fetch(`/api/supplier/${supplier.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error updating profile");
      }

      toast.success("Profile image updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Error processing image:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error processing image. Please try again.",
      );
      toast.error("Failed to update profile image");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (type: "bio" | "businessPhone", newData: string) => {
    try {
      const formData = new FormData();
      formData.append(type, newData);

      const response = await fetch(`/api/supplier/${supplier.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error updating profile");
      }

      if (type === "bio") {
        setBio(newData);
        setIsBioModalOpen(false);
      } else {
        setPhone(newData);
        setIsPhoneModalOpen(false);
      }

      toast.success(
        `${type === "bio" ? "Bio" : "Phone number"} updated successfully`,
      );
      router.refresh();
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      toast.error(
        `Failed to update ${type === "bio" ? "bio" : "phone number"}`,
      );
    }
  };

  const submitPhone = (data: z.infer<typeof phoneSchema>) => {
    handleSave("businessPhone", data.phone);
  };

  return (
    <div className="max-w-[60vw] mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg space-y-4 text-sm w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative group shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={supplier?.businessPicture || "/placeholder-business.jpg"}
              alt={supplier?.businessName || "Business"}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Upload button overlay */}
          <button
            className="absolute bottom-0 right-0 rounded-full bg-black/90 p-1.5 cursor-pointer hover:bg-black/70 transition-colors"
            onClick={handleFileUpload}
            disabled={loading}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {loading && (
                <Loader color="white" className="animate-spin w-4 h-4" />
              )}
              {!loading && <ImageUp color="white" className="w-4 h-4" />}
            </div>
          </button>

          {/* Hidden file input */}
          <Input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {supplier.businessName}
              </h1>
              <p className="text-green-600 text-xs font-semibold">
                RawMats Supplier
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/supplier/${supplier.businessName}`}>
                <Button size="sm" className="text-xs">
                  User view
                </Button>
              </Link>
            </div>
          </div>
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
      </div>

      <hr className="border-gray-300" />

      <div className="space-y-3">
        <h2 className="text-base font-medium text-gray-800">
          Business Details
        </h2>
        <div>
          <div className="flex justify-between items-center">
            <strong className="text-gray-700">Bio</strong>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 flex items-center gap-1 p-0 h-auto"
              onClick={() => setIsBioModalOpen(true)}
            >
              {supplier?.bio ? (
                <>
                  <Pencil size={12} /> Edit Bio
                </>
              ) : (
                <>
                  Add Bio <span className="text-lg font-bold">+</span>
                </>
              )}
            </Button>
          </div>
          {supplier?.bio ? (
            <p className="text-gray-600 text-xs mt-1 text-balance truncate">
              {supplier.bio}
            </p>
          ) : (
            <p className="text-gray-400 italic text-xs mt-1">No bio added.</p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <strong className="text-gray-700">Location:</strong>
            <a
              href={supplier.businessLocation}
              target="_blank"
              className="text-blue-500 text-xs mt-1 cursor-pointer hover:underline"
            >
              <br />
              {supplier?.businessLocation || "No location added"}
            </a>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      <div className="space-y-3">
        <h2 className="text-base font-medium text-gray-800">
          Supplier Personal Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <strong className="text-gray-700">Supplier name:</strong>
            </div>
            <p className="text-gray-600 text-xs mt-1">{userData.displayName}</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <strong className="text-gray-700">Email:</strong>
            </div>
            <p className="text-gray-600 text-xs mt-1">{userData.email}</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <strong className="text-gray-700">Phone:</strong>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 flex items-center gap-1 p-0 h-auto"
                onClick={() => setIsPhoneModalOpen(true)}
              >
                <Pencil size={12} /> Edit Phone Number
              </Button>
            </div>
            <p className="text-gray-600 text-xs mt-1">
              {phone || "No phone number added"}
            </p>
          </div>
        </div>
      </div>

      {/* Bio Edit Modal */}
      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Bio</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Textarea
              className="w-full p-2 border border-gray-300 rounded-md bg-transparent relative z-10"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short description about your business..."
              style={{ resize: "none" }}
            />
          </div>

          {/* Character Counter */}
          <div
            className={`text-sm mt-2 text-right ${bio.length > 1500 ? "text-red-600 font-medium" : "text-gray-500"}`}
          >
            {bio.length}/1500
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsBioModalOpen(false);
                setBio(supplier.bio);
              }}
            >
              <X size={14} className="mr-1" /> Cancel
            </Button>
            <Button
              onClick={() => handleSave("bio", bio)}
              disabled={bio.length > 1500}
              className={
                bio.length > 1500 ? "opacity-50 cursor-not-allowed" : ""
              }
            >
              Save Bio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phone Edit Modal */}
      <Dialog open={isPhoneModalOpen} onOpenChange={setIsPhoneModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Phone Number</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitPhone)}
              className="flex flex-col items-start space-y-8"
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormControl className="w-full">
                      <PhoneInput
                        defaultCountry="PH"
                        international
                        countryCallingCodeEditable={false}
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-left">
                      Enter a phone number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Image Cropper */}
      {showCropper && cropImage && (
        <Dialog open={showCropper} onOpenChange={setShowCropper}>
          <DialogContent className="p-0 bg-transparent border-none shadow-none min-w-fit">
            <ImageCropper
              image={cropImage as string}
              onCropComplete={handleCropComplete}
              onCancel={() => setShowCropper(false)}
              aspectRatio={1} // 1:1 aspect ratio for profile pictures
              cropShape="round"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EditableProfileCard;
