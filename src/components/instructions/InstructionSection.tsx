"use client";

import React from "react";
import Image from "next/image";

interface InstructionSectionProps {
  title: string;
  description: string;
  imagePath?: string;
  imageAlt?: string;
}

const InstructionSection = ({
  title,
  description,
  imagePath,
  imageAlt,
}: InstructionSectionProps) => {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-neutral-500 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-semibold text-text-500 mb-4">{title}</h3>
      <p className="text-neutral-900 mb-4 leading-relaxed">{description}</p>
      {imagePath && (
        <div className="mt-4">
          <Image
            src={imagePath}
            alt={imageAlt || title}
            width={800}
            height={500}
            className="rounded-lg border border-neutral-500 max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default InstructionSection;
