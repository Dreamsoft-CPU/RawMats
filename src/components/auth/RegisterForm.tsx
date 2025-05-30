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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RegisterFormData, RegisterSchema } from "@/lib/types/register.type";
import Link from "next/link";
import { PhoneInput } from "@/components/ui/phone-input";
import { Check, Eye, EyeOff, X } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = [
    {
      label: "At least 8 characters long",
      test: (pwd: string) => pwd.length >= 8,
    },
    {
      label: "Contains at least one uppercase letter",
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      label: "Contains at least one lowercase letter",
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    {
      label: "Contains at least one number",
      test: (pwd: string) => /\d/.test(pwd),
    },
  ];

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      displayName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { message } = await response.json();
        if (message) showErrorMessage(message);
        else showErrorMessage("An unexpected error occurred");
      } else {
        setConfirmEmailSent(true);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      const message =
        e instanceof Error ? e.message : "An unexpected error occurred";
      showErrorMessage(message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-visible rounded-2xl backdrop-blur-xl bg-white/70 border border-gray-200 shadow-[0px_6px_16px_rgba(74,144,226,0.4)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          {confirmEmailSent ? (
            <Fragment>
              <div className="flex items-center justify-center py-64 flex-col gap-6">
                <div className="text-3xl font-extrabold text-[#4A90E2] drop-shadow-md">
                  Registration Completed
                </div>
                <div className="flex items-center flex-col text-sm gap-2">
                  <p className="text-gray-600 font-medium leading-relaxed text-center">
                    Check your email to confirm your registration!
                  </p>
                  <div>
                    <Button className="max-w-[180px] w-full rounded-2xl py-3 text-lg bg-[#6AB0E3] text-white shadow-md hover:bg-[#92B6D5] focus:ring-2 focus:ring-blue-500 transition-all">
                      <Link href="/login">Go to Home</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Form {...form}>
                <form
                  className="p-6 md:p-8 space-y-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col items-start text-left space-y-3">
                    <h1 className="text-3xl font-extrabold text-[#4A90E2] drop-shadow-md">
                      Join the Community
                    </h1>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">
                      Register a new{" "}
                      <span className="text-[#4A90E2] font-semibold">
                        RawMats
                      </span>{" "}
                      account.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="rawmats@example.com"
                              className="bg-white border border-indigo-800 rounded-2xl px-4 py-2 shadow-md"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              className="bg-white border border-indigo-800 rounded-2xl px-4 py-2 shadow-md"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <PhoneInput
                              className="bg-white border border-indigo-800 rounded-e-lg rounded-s-lg shadow-md"
                              placeholder="Enter a phone number"
                              defaultCountry="PH"
                              international
                              countryCallingCodeEditable={false}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="*******"
                                className="bg-white border border-indigo-800 rounded-2xl px-4 py-2 pr-12 shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />

                          {/* Password Requirements */}
                          <div className="mt-3 space-y-2">
                            <p className="text-sm font-medium text-gray-700">
                              Password requirements:
                            </p>
                            <div className="space-y-1">
                              {passwordRules.map((rule, index) => {
                                const isValid =
                                  field.value && rule.test(field.value);
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    {isValid ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <X className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span
                                      className={`text-sm ${isValid ? "text-green-600" : "text-gray-500"}`}
                                    >
                                      {rule.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="*******"
                                className="bg-white border border-indigo-800 rounded-2xl px-4 py-2 pr-12 shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter your password again
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
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

                  <div className="relative text-center text-sm my-4">
                    <span className="relative z-10 bg-white px-2 text-muted-foreground">
                      Or
                    </span>
                    <div className="absolute inset-0 top-1/2 border-t border-gray-300"></div>
                  </div>

                  <div className="text-center text-sm">
                    You already have an account{" "}
                    <Link
                      href="/login"
                      className="text-indigo-600 hover:underline"
                    >
                      Sign in
                    </Link>
                  </div>
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
