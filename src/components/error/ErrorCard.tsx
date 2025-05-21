"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ErrorCardProps extends React.ComponentProps<"div"> {
  errorMessage: string;
}

export function ErrorCard({
  errorMessage,
  className,
  ...props
}: ErrorCardProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-gray-200 shadow-[0px_6px_16px_rgba(74,144,226,0.4)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center text-center space-y-6">
              <h1 className="text-3xl font-extrabold text-[#4A90E2] drop-shadow-md">
                Oops!
              </h1>
              <div className="text-gray-600 text-md font-medium leading-relaxed">
                {errorMessage}
              </div>

              <Button
                className="max-w-[180px] w-full rounded-2xl py-3 text-lg bg-[#6AB0E3] opacity-500
                text-white shadow-md hover:bg-[#92B6D5] focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <Link href="/">Go Back</Link>
              </Button>
            </div>
          </div>

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
        If you continue experiencing issues, please contact{" "}
        <Link
          href="mailto:dti.rawmats@gmail.com"
          className="text-indigo-600 hover:underline"
        >
          dti.rawmats@gmail.com
        </Link>
      </div>
    </div>
  );
}
