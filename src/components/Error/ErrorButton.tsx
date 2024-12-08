"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ErrorButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/")}
      className="bg-accent-500 text-accent-foreground hover:bg-accent-700"
    >
      Return to Home
    </Button>
  );
};

export default ErrorButton;
