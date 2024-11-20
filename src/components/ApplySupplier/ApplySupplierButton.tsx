"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const ApplySupplierButton = () => {
  const router = useRouter();
  const applySupplier = async () => {
    router.push("/apply-supplier");
  };
  return (
    <Button
      className="bg-rawmats-accent-300 hover:bg-rawmats-accent-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
      onClick={applySupplier}
    >
      Apply as a Supplier
    </Button>
  );
};

export default ApplySupplierButton;
