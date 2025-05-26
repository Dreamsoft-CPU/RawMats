"use client";
import { useState, Fragment } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  SupplierRegistrationFormData,
  SupplierRegistrationFormSchema,
} from "@/lib/types/supplierRegistration.type";
import FileUploadWithPreview from "./FileUploadWithPreview";
import MapDialog from "./MapDialog";
import { useRouter } from "next/navigation";
import { PhoneInput } from "../ui/phone-input";
import Link from "next/link";

export function SupplierRegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrationSent, setRegistrationSent] = useState(false);
  const [locationName, setLocationName] = useState<string>("");
  const router = useRouter();

  const form = useForm<SupplierRegistrationFormData>({
    resolver: zodResolver(SupplierRegistrationFormSchema),
    defaultValues: {
      businessName: "",
      businessLocation: "",
      businessPhone: "",
      businessDocuments: [],
    },
  });

  const handleLocationSelect = (location: string, locName: string) => {
    form.setValue("businessLocation", location);
    setLocationName(locName);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const onSubmit = async (data: SupplierRegistrationFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("businessName", data.businessName);
      formData.append("businessLocation", data.businessLocation);
      formData.append("businessPhone", data.businessPhone);
      formData.append("locationName", locationName);

      // Append each file in the businessDocuments array
      data.businessDocuments.forEach((file) => {
        formData.append("businessDocuments", file);
      });

      const response = await fetch("/api/supplier/apply", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const { message } = await response.json();
        if (message) showErrorMessage(message);
        else showErrorMessage("An unexpected error occured");
      } else {
        setRegistrationSent(true);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      const message =
        e instanceof Error ? e.message : "An unexpected error occured";
      showErrorMessage(message);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full items-center", className)}
      {...props}
    >
      <Card className="overflow-visible rounded-2xl backdrop-blur-xl bg-white/70 border border-gray-200 shadow-[0px_6px_16px_rgba(74,144,226,0.4)] max-w-4xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {registrationSent ? (
            <Fragment>
              <div className="flex items-center justify-center py-64 flex-col gap-6 px-12">
                <div className="text-3xl font-extrabold text-[#4A90E2] drop-shadow-md">
                  Applied as a Supplier
                </div>
                <div className="flex items-center flex-col text-sm gap-2">
                  <p className="text-gray-600 font-medium leading-relaxed text-center">
                    Check your notifications from time to time
                  </p>
                  <p className="text-gray-600 font-medium leading-relaxed text-center">
                    if you have been verified!
                  </p>
                  <Button
                    className="max-w-[180px] w-full rounded-2xl py-3 text-lg bg-[#6AB0E3] text-white shadow-md hover:bg-[#92B6D5] focus:ring-2 focus:ring-blue-500 transition-all"
                    onClick={() => router.push("/")}
                  >
                    Go back to Home
                  </Button>
                </div>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Form {...form}>
                <form
                  className="p-6 md:p-8 space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col items-start text-left space-y-3">
                    <h1 className="text-3xl font-extrabold text-[#4A90E2] drop-shadow-md">
                      Post on RawMats
                    </h1>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">
                      Apply to be a Supplier on the Platform
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Raw Materials and Foods"
                              className="bg-white border border-indigo-800 rounded-2xl px-4 py-2 shadow-md"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative z-50">
                              <PhoneInput
                                defaultCountry="PH"
                                className="bg-white border border-indigo-800 rounded-e-lg rounded-s-lg shadow-md"
                                placeholder="Enter a phone number..."
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Location</FormLabel>
                          <FormControl>
                            <div className="flex w-full items-center space-x-2">
                              <Input
                                readOnly
                                {...field}
                                className="bg-white border border-indigo-800 rounded-2xl px-4 py-2 shadow-md"
                              />
                              <MapDialog
                                onConfirmLocation={handleLocationSelect}
                              />
                            </div>
                          </FormControl>
                          {locationName && (
                            <div className="text-sm text-gray-600 mt-1 overflow-hidden text-ellipsis">
                              {locationName}
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessDocuments"
                      render={({ field }) => (
                        <FileUploadWithPreview field={field} />
                      )}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="max-w-[180px] w-full rounded-2xl py-3 text-lg bg-[#6AB0E3] text-white shadow-md hover:bg-[#92B6D5] focus:ring-2 focus:ring-blue-500 transition-all"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </Button>
                  </div>

                  {errorMessage && (
                    <div className="text-red-500 text-sm text-center">
                      {errorMessage}
                    </div>
                  )}
                </form>
              </Form>
            </Fragment>
          )}
          <div className="relative hidden md:block rounded-r-2xl overflow-hidden">
            <div
              className="absolute inset-0 bg-[#DCEFFC]"
              style={{ clipPath: "ellipse(100% 80% at 100% 50%)" }}
            ></div>
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{
                clipPath: "ellipse(90% 70% at 95% 55%)",
                backgroundColor: "rgba(248, 251, 255, 0.7)",
              }}
            ></div>
            <Image
              width={500}
              height={500}
              src="/logo.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-contain mix-blend-multiply dark:brightness-[0.8] drop-shadow-lg"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="text-indigo-600 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-indigo-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
