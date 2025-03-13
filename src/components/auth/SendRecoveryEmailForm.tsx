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
      <Card className="overflow-hidden">
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
                      <h1 className="text-2xl font-bold">Recovery</h1>
                      <p className="text-balance text-muted-foreground">
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
                              <Input {...field} placeholder="*******" />
                            </FormControl>
                            <FormDescription>
                              We will send an email for recovery
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sending..." : "Send Recovery Email"}
                    </Button>
                    <div className="text-feedback-error flex items-center justify-center">
                      {!!errorMessage && errorMessage}
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                    <div className="text-center text-sm">
                      Remember your password?{" "}
                      <a href="#" className="underline underline-offset-4">
                        <Link href="/login">Sign in</Link>
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
              className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
