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
import { sendResetPassword } from "../AuthHandlers/SendRecoveryHandler";
import { AuthApiError } from "@supabase/supabase-js";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type FormData = z.infer<typeof schema>;

const ResetPasswordForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await sendResetPassword(data.email);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(
          `/done?header=${encodeURIComponent("Password Reset")}&message=${encodeURIComponent("If your email exists, the reset link has been sent, check your inbox!")}&type=reset`,
        );
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AuthApiError) {
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-body font-semibold text-rawmats-text-700">
                  Enter your email address
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
          {error && (
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-rawmats-feedback-error">{error}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col space-y-1 text-sm text-rawmats-text-500">
              <a href="/login" className="hover:text-rawmats-accent-300">
                Go back to login
              </a>
              <a href="/signup" className="hover:text-rawmats-accent-300">
                {"Don't have an account?"}
              </a>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-rawmats-primary-700 text-white rounded-lg hover:bg-rawmats-primary-300 active:bg-rawmats-primary-700 transition-colors"
            >
              {isLoading ? "Sending email..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
