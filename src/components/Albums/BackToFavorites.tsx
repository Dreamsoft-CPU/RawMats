"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackToFavorites = () => {
  const router = useRouter();
  return (
    <div className="flex">
      <Button
        onClick={() => router.push("/favorites")}
        className=" bg-rawmats-secondary-700 hover:bg-rawmats-secondary-900 text-rawmats-primary-700"
      >
        <ArrowLeft className="h-5 w-5 md:mr-2" />
        <span className="md:block hidden">Back to Favorites</span>
      </Button>
    </div>
  );
};

export default BackToFavorites;
