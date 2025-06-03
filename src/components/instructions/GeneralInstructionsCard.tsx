"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import InstructionSection from "./InstructionSection";

const GeneralInstructionsCard = () => {
  const { t } = useLanguage();

  const sections = [
    {
      title: t("sidebar"),
      description: t("sidebarDesc"),
      imagePath: "/instructions/general/homepage/sidebar.png",
    },
    {
      title: t("homepage"),
      description: t("homepageDesc"),
      imagePath: "/instructions/general/homepage/browse-homepage.png",
    },
    {
      title: t("searchBar"),
      description: t("searchBarDesc"),
      imagePath: "/instructions/general/homepage/search-bar.png",
    },
    {
      title: t("productPage"),
      description: t("productPageDesc"),
      imagePath: "/instructions/general/homepage/product-page.png",
    },
    {
      title: t("productClickables"),
      description: t("productClickablesDesc"),
      imagePath: "/instructions/general/homepage/product-clickables.png",
    },
    {
      title: t("favoriteInHomepage"),
      description: t("favoriteInHomepageDesc"),
      imagePath: "/instructions/general/homepage/browse-homepage.png",
    },
    {
      title: t("newFavorite"),
      description: t("newFavoriteDesc"),
      imagePath: "/instructions/general/favorites/new-favorites.png",
    },
    {
      title: t("createAlbum"),
      description: t("createAlbumDesc"),
      imagePath: "/instructions/general/favorites/create-album.png",
    },
    {
      title: t("yourFirstAlbum"),
      description: t("yourFirstAlbumDesc"),
      imagePath: "/instructions/general/favorites/your-first-album.png",
    },
    {
      title: t("addToAlbum"),
      description: t("addToAlbumDesc"),
      imagePath: "/instructions/general/favorites/add-to-album.png",
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

export default GeneralInstructionsCard;
