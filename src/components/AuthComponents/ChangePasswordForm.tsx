"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { updatePassword } from "../AuthHandlers/ChangePasswordHandler";

const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ChangePasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const result = await updatePassword(data.password);
      if (result.error) {
        setErrorMessage(result.error);
      } else {
        router.push(
          `/done?header=${encodeURIComponent("Password Reset")}&message=${encodeURIComponent("Your password has been reset, log in again!")}&type=reset`,
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
    <div className="w-full mx-auto flex flex-col justify-center p-6 space-y-6">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-rawmats-text-700">
          Change Password
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-body font-semibold text-rawmats-text-700">
                  New Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
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
                <FormLabel className="text-body font-semibold text-rawmats-text-700">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errorMessage && (
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-rawmats-feedback-error">
                {errorMessage}
              </span>
            </div>
          )}
          <div className="flex items-center justify-end mt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-rawmats-primary-700 text-white rounded-lg hover:bg-rawmats-primary-300 active:bg-rawmats-primary-700 transition-colors"
            >
              {isLoading ? "Changing password..." : "Change Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
