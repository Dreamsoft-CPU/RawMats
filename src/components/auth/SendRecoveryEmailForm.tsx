"use client";
import { Fragment, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { SendEmailFormData, SendEmailSchema } from "@/lib/types/recover.type";
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

export function SendRecoveryEmailForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const form = useForm<SendEmailFormData>({
    resolver: zodResolver(SendEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const onSubmit = async (data: SendEmailFormData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/recover/send", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { message } = await response.json();
        if (message) showErrorMessage(message);
        else showErrorMessage("An unexpected error occured");
      } else {
        setPasswordResetSuccess(true);
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
          {passwordResetSuccess ? (
            <Fragment>
              <div className="flex items-center justify-center py-64 flex-col gap-6">
                <div className="font-bold text-xl">Recovery Email Sent</div>
                <div className="flex items-center flex-col text-sm gap-2">
                  Check your inbox and spam to view your recovery link
                  <div>
                    <Button>
                      <Link href="/login">Go to Login</Link>
                    </Button>
                  </div>
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
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-3xl font-extrabold text-[#4A90E2] drop-shadow-md">
                        Recovery
                      </h1>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">
                        Recover your account with a new password
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="*******"
                                className="bg-white border border-indigo-800 rounded-2xl px-4 py-2 shadow-md"
                              />
                            </FormControl>
                            <FormDescription>
                              We will send an email for recovery
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        className="max-w-[180px] w-full rounded-2xl py-3 text-sm bg-[#6AB0E3] opacity-500
                              text-white shadow-md hover:bg-[#92B6D5] focus:ring-2 focus:ring-blue-500 transition-all"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send Recovery Email"}
                      </Button>
                      <div className="text-feedback-error flex items-center justify-center">
                        {!!errorMessage && errorMessage}
                      </div>
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                    <div className="text-center text-sm">
                      Remember your password?{" "}
                      <a href="#" className="underline underline-offset-4">
                        <Link
                          href="/login"
                          className="text-indigo-600 hover:underline"
                        >
                          Sign in
                        </Link>
                      </a>
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
              className="absolute inset-0 h-full w-full object-contain mix-blend-multiply dark:brightness-[0.8] drop-shadow-lg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
