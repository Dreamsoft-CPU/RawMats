"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: "en", name: "English" },
    { code: "hil", name: "Hiligaynon" },
    { code: "tl", name: "Tagalog" },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-text-500 mb-2">
        {t("selectLanguage")}
      </label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "hil" | "tl")}
        className="block w-full px-3 py-2 border border-neutral-500 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 bg-white text-text-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
