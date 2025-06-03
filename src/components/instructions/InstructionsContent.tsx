"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import InstructionsCard from "./InstructionsCard";

const InstructionsContent = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full p-4">
      <div className="text-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-blue-950 mb-4">
          {t("instructions")}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn how to use our platform effectively. Choose a category below to
          get started.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <LanguageSelector />
      </div>

      <InstructionsCard />
    </div>
  );
};

export default InstructionsContent;
