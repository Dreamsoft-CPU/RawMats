"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const schema = z
  .object({
    name: z
      .string()
      .min(6, { message: "Name must be at least 6 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Sign up attempt with:", data);
  };

  const handleGoogleSignUp = () => {
    console.log("Sign up with Google");
  };

  return (
    <div className="w-full mx-auto flex flex-col justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-6 ">
        <div>
          <Label
            htmlFor="name"
            className="text-lg font-semibold text-rawmats-text-700"
          >
            Name
          </Label>
          <Input
            type="text"
            id="name"
            {...register("name")}
            placeholder="Full Name"
            className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-rawmats-feedback-error">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="email"
            className="text-lg font-semibold text-rawmats-text-700"
          >
            Email Address
          </Label>
          <Input
            type="email"
            id="email"
            {...register("email")}
            placeholder="Email"
            className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-rawmats-feedback-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-lg font-semibold text-rawmats-text-700"
          >
            Password
          </Label>
          <Input
            type="password"
            id="password"
            {...register("password")}
            placeholder="********"
            className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-rawmats-feedback-error">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="confirmPassword"
            className="text-lg font-semibold text-rawmats-text-700"
          >
            Confirm Password
          </Label>
          <Input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
            placeholder="********"
            className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-rawmats-feedback-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="justify-between flex flex-col mt-2 md:mt-0 md:flex-row items-center">
          <Link
            className="text-rawmats-text-500 text-sm font-medium italic"
            href="/login"
          >
            Already have an account?
          </Link>
          <div className="flex items-center mt-4">
            <Button
              type="submit"
              className="px-6 py-2 mb-2 bg-rawmats-primary-700 text-white rounded-lg hover:bg-rawmats-primary-300 active:bg-rawmats-primary-700 transition-colors"
            >
              Create Account
            </Button>
          </div>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-rawmats-neutral-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-rawmats-text-500">OR</span>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center mt-3">
        <Button
          onClick={handleGoogleSignUp}
          className="md:w-full w-fit py-4 md:py-6 mb-3 max-w-sm px-4 bg-rawmats-primary-700 text-white rounded-lg hover:bg-rawmats-primary-300 active:bg-rawmats-primary-100 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Sign up with Google</span>
        </Button>
      </div>
    </div>
  );
}
