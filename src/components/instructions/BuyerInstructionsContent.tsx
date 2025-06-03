"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import BuyerInstructionsCard from "./BuyerInstructionsCard";

const BuyerInstructionsContent = () => {
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
          {t("buyer")} {t("instructions")}
        </h1>
        <p className="text-lg text-gray-600">
          Learn how to purchase products and manage your favorites
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <LanguageSelector />
      </div>

      <BuyerInstructionsCard />
    </div>
  );
};

export default BuyerInstructionsContent;
