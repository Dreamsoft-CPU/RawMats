"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { LoginFormData, LoginSchema } from "@/lib/types/login.type";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { message } = await response.json();
        if (message) showErrorMessage(message);
        else showErrorMessage("An unexpected error occured");
      } else {
        router.push("/");
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-gray-200 shadow-[0px_6px_16px_rgba(74,144,226,0.4)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              className="p-6 md:p-8 space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col items-start text-left space-y-3">
                <h1 className="text-3xl font-extrabold text-[#4A90E2] drop-shadow-md">
                  Welcome Back!
                </h1>
                <p className="text-gray-600 text-sm font-medium leading-relaxed">
                  Log in to your{" "}
                  <span className="text-[#4A90E2] font-semibold">RawMats</span>{" "}
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
                      <FormDescription>
                        Enter your registered email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/recover/send"
                          className="text-sm text-indigo-800 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            className="bg-white border border-indigo-800 rounded-2xl px-4 py-2 shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                      <FormDescription>Enter your password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="max-w-[180px] w-full rounded-2xl py-3 text-lg bg-[#6AB0E3] opacity-500
                  text-white shadow-md hover:bg-[#92B6D5] focus:ring-2 focus:ring-blue-500 transition-all"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
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
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-indigo-600 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </Form>

          <div className="relative hidden md:block rounded-r-2xl overflow-hidden">
            <div
              className="absolute inset-0 bg-[#DCEFFC] "
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
