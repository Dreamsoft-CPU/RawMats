"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const InstructionsCard = () => {
  const { t } = useLanguage();

  const categories = [
    {
      title: t("general"),
      description: "Learn the basics of navigating the platform",
      href: "/instructions/general",
      icon: "🏠",
      color: "bg-secondary-100 border-secondary-300 hover:bg-secondary-300",
    },
    {
      title: t("buyer"),
      description: "Instructions for purchasing and managing favorites",
      href: "/instructions/buyer",
      icon: "🛒",
      color: "bg-accent-100/10 border-accent-300 hover:bg-accent-100/20",
    },
    {
      title: t("supplier"),
      description: "Guide for suppliers to list and manage products",
      href: "/instructions/supplier",
      icon: "🏭",
      color: "bg-primary-100/10 border-primary-300 hover:bg-primary-100/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {categories.map((category) => (
        <Link
          key={category.href}
          href={category.href}
          className={`block p-6 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${category.color}`}
        >
          <div className="text-4xl mb-4">{category.icon}</div>
          <h3 className="text-xl font-semibold text-text-500 mb-2">
            {category.title}
          </h3>
          <p className="text-neutral-900">{category.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default InstructionsCard;
