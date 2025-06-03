"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import InstructionSection from "./InstructionSection";

const BuyerInstructionsCard = () => {
  const { t } = useLanguage();

  const sections = [
    {
      title: t("productPage"),
      description: "Navigate to any product first",
      imagePath: "/instructions/general/homepage/product-page.png",
    },
    {
      title: t("supplierDetails"),
      description: t("supplierDetailsDesc"),
      imagePath: "/instructions/buyer/conversations/contact-supplier.png",
    },
    {
      title: t("converseWithSupplier"),
      description: t("converseWithSupplierDesc"),
      imagePath: "/instructions/buyer/conversations/converse-with-supplier.png",
    },
    {
      title: t("supplierProfile"),
      description: t("supplierProfileDesc"),
      imagePath: "/instructions/buyer/conversations/supplier-profile.png",
    },
    {
      title: t("rateTheProduct"),
      description: t("rateTheProductDesc"),
      imagePath: "/instructions/buyer/conversations/rate-after-buying.png",
    },
    {
      title: t("newReview"),
      description: t("newReviewDesc"),
      imagePath: "/instructions/buyer/conversations/new-review.png",
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

export default BuyerInstructionsCard;
