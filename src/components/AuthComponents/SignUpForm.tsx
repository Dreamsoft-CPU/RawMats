"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signup } from "../AuthHandlers/SignupHandler";
import { SignupFormData } from "@/types/types";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const payload = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        payload.append(key, value),
      );

      await signup(payload);
      console.log("Signup successful", data);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col p-6 space-y-1"
      >
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
            htmlFor="phone"
            className="text-lg font-semibold text-rawmats-text-700"
          >
            Phone Number
          </Label>
          <Input
            type="text"
            id="phone"
            {...register("phone")}
            placeholder="09xxxxxxxxx"
            className="mt-1 w-full rounded-lg border-rawmats-neutral-700 shadow-sm focus:border-rawmats-accent-300 focus:ring-rawmats-accent-300 bg-white text-rawmats-text-700"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-rawmats-feedback-error">
              {errors.phone.message}
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
              className="px-6 py-2 mb-2 bg-rawmats-primary-700 text-white rounded-lg hover:bg-rawmats-primary-300 active:bg-rawmats-primary-700 transition-colors"
            >
              Create Account
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}