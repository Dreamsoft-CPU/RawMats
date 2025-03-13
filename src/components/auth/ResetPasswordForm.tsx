"use client";
import { Fragment, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  ResetPasswordFormData,
  ResetPasswordSchema,
} from "@/lib/types/recover.type";
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

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
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

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/recover/reset", {
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
                <div className="font-bold text-xl">Password Reset</div>
                <div className="flex items-center flex-col text-sm gap-2">
                  Your password has been reset
                  <div>
                    <Button>
                      <Link href="/">Go to Home</Link>
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
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="*******"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your new password
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                type="confirmPassword"
                                placeholder="*******"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your password again
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Resetting..." : "Change Password"}
                    </Button>
                    <div className="text-feedback-error flex items-center justify-center">
                      {!!errorMessage && errorMessage}
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or
                      </span>
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
