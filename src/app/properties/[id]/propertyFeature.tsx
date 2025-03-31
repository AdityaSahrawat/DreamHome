"use client";

import React from "react";
import { Check } from "lucide-react";

interface PropertyFeaturesProps {
  features: {
    category: string;
    items: string[];
  }[];
}

export const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ features }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Property Features</h3>
      
      <div className="grid gap-8">
        {features.map((category, index) => (
          <div key={index}>
            <h4 className="text-lg font-medium mb-4">{category.category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};