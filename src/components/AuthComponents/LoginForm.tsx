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
import { login } from "../AuthHandlers/LoginHandler";
import InlineLoading from "../Loading/InlineLoading";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await login(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
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
          {error && (
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-rawmats-feedback-error">{error}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col space-y-1 text-sm text-rawmats-text-500">
              <a href="/signup" className="hover:text-rawmats-accent-300">
                Need an account?
              </a>
              <a href="/recover" className="hover:text-rawmats-accent-300">
                Forgot my password
              </a>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-rawmats-primary-700 text-white rounded-lg hover:bg-rawmats-primary-300 active:bg-rawmats-primary-700 transition-colors"
            >
              {isLoading ? <InlineLoading message="Logging in" /> : "Login"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
