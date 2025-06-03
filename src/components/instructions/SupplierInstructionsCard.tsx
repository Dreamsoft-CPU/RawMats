"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import InstructionSection from "./InstructionSection";

const SupplierInstructionsCard = () => {
  const { t } = useLanguage();

  const sections = [
    {
      title: t("applyAsSupplier"),
      description: t("applyAsSupplierDesc"),
      imagePath: "/instructions/supplier/apply-as-supplier.png",
    },
    {
      title: t("mapSearch"),
      description: t("mapSearchDesc"),
      imagePath: "/instructions/supplier/map-search.png",
    },
    {
      title: t("applicationSubmitted"),
      description: t("applicationSubmittedDesc"),
      imagePath: "/instructions/supplier/wait-to-be-verified.png",
    },
    {
      title: t("waitForVerification"),
      description: t("waitForVerificationDesc"),
      imagePath: "/instructions/supplier/notified-for-verification.png",
    },
    {
      title: t("supplierDashboard"),
      description: t("supplierDashboardDesc"),
      imagePath: "/instructions/supplier/supplier-dashboard-and-sidebar.png",
    },
    {
      title: t("listYourProduct"),
      description: t("listYourProductDesc"),
      imagePath: "/instructions/supplier/create-a-product.png",
    },
    {
      title: t("createAProduct"),
      description: t("createAProductDesc"),
      imagePath: "/instructions/supplier/create-product-page.png",
    },
    {
      title: t("waitForProductVerification"),
      description: t("waitForProductVerificationDesc"),
      imagePath: "/instructions/supplier/wait-for-verify.png",
    },
    {
      title: t("verified"),
      description: t("verifiedDesc"),
      imagePath: "/instructions/supplier/new-product.png",
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <InstructionSection
          key={index}
          title={section.title}
          description={section.description}
          imagePath={section.imagePath}
          imageAlt={section.title}
        />
      ))}
    </div>
  );
};

export default SupplierInstructionsCard;
