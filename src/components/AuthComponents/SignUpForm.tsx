"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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
import { signup } from "../AuthHandlers/SignupHandler";
import InlineLoading from "../Loading/InlineLoading";

const schema = z
  .object({
    name: z
      .string()
      .min(6, { message: "Name must be at least 6 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().regex(/^09\d{9}$/, {
      message: "Phone number must be 11 digits and start with '09'",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        payload.append(key, value),
      );

      const result = await signup(payload);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(
          `/done?header=${encodeURIComponent("Email confirmation sent")}&message=${encodeURIComponent("Check your inbox for a confirmation link")}&type=email`,
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
    <div className="w-full mx-auto flex flex-col justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col p-6 space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-rawmats-text-700">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Full Name"
                    className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-rawmats-text-700">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-rawmats-text-700">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="09xxxxxxxxx"
                    className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
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
                <FormLabel className="text-lg font-semibold text-rawmats-text-700">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-rawmats-text-700">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-rawmats-feedback-error">{error}</span>
            </div>
          )}

          <div className="justify-between flex flex-row mt-2 md:mt-0 md:flex-row items-center">
            <Link
              className="text-rawmats-primary-700 text-xs font-medium italic hover:text-rawmats-primary-300 lg:text-sm"
              href="/login"
            >
              Already have an account?
            </Link>
            <div className="flex items-center mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-rawmats-primary-700 text-white rounded-lg hover:bg-rawmats-primary-300 active:bg-rawmats-primary-700 transition-colors"
              >
                {isLoading ? <InlineLoading message="Signing up" /> : "Sign Up"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
