"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import SupplierInstructionsCard from "./SupplierInstructionsCard";

const SupplierInstructionsContent = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full p-4">
      <div className="mb-6">
        <Link
          href="/instructions"
          className="text-accent-500 hover:text-accent-700 font-medium"
        >
          ← {t("instructions")}
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-blue-950 mb-4">
          {t("supplier")} {t("instructions")}
        </h1>
        <p className="text-lg text-gray-600">
          Learn how to become a supplier and manage your products
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <LanguageSelector />
      </div>

      <SupplierInstructionsCard />
    </div>
  );
};

export default SupplierInstructionsContent;
