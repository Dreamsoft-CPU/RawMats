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

export function SupplierRegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrationSent, setRegistrationSent] = useState(false);
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

  const handleLocationSelect = (location: string) => {
    form.setValue("businessLocation", location);
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
      <Card className="overflow-hidden max-w-4xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {registrationSent ? (
            <Fragment>
              <div className="flex items-center justify-center py-64 flex-col gap-6 px-12">
                <div className="font-bold text-xl">Applied as a Supplier</div>
                <div className="flex items-center flex-col text-sm gap-2">
                  <p>Check your notifications from time to time</p>
                  <p>if you have been verified!</p>
                  <Button onClick={() => router.push("/")}>
                    Go back to Home
                  </Button>
                </div>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Form {...form}>
                <form
                  className="p-6 md:p-8"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Post on RawMats</h1>
                      <p className="text-balance text-muted-foreground">
                        Apply to be a Supplier on the Platform
                      </p>
                    </div>
                    <div className="grid gap-2">
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="businessPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Phone</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="(XXX) XXX-XXXX or (63) XXX-XXX-XXXX"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="businessLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Location</FormLabel>
                            <FormControl>
                              <div className="flex w-full items-center space-x-2">
                                <Input readOnly {...field} />
                                <MapDialog
                                  onConfirmLocation={handleLocationSelect}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="businessDocuments"
                        render={({ field }) => (
                          <FileUploadWithPreview field={field} />
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Registering..." : "Register"}
                    </Button>
                    <div className="text-feedback-error flex items-center justify-center">
                      {!!errorMessage && errorMessage}
                    </div>
                  </div>
                </form>
              </Form>
            </Fragment>
          )}
          <div className="relative hidden bg-muted md:block">
            <Image
              width={500}
              height={500}
              src="/logo.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
