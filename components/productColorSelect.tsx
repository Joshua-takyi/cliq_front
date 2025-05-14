"use client";
import React from "react";

interface ProductColorSelectorProps {
  product: {
    colors: string[];
  };
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const ProductColorSelector: React.FC<ProductColorSelectorProps> = ({
  product,
  selectedColor,
  setSelectedColor,
}) => {
  return (
    <div className="flex gap-4 items-center">
      {product.colors.map((color) => (
        <div key={color} className="relative group">
          <button
            onClick={() => setSelectedColor(color)}
            className={`w-6 h-6 rounded-full transition-all duration-300 transform
                            ${
                              selectedColor === color
                                ? "scale-110 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                                : "hover:scale-105 hover:shadow-md"
                            }
                        `}
            style={{ backgroundColor: color }}
            aria-label={`Select ${color} color`}
            aria-pressed={selectedColor === color}
            title={`${color} color option`}
          >
            {selectedColor === color && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`w-2 h-2 rounded-full ${
                    getContrastColor(color) === "white"
                      ? "bg-white"
                      : "bg-black"
                  } opacity-70`}
                ></span>
              </span>
            )}
          </button>
          <span
            className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap
                        transition-opacity duration-300
                        ${selectedColor === color ? "opacity-100" : "opacity-0"}
                     `}
          >
            {formatColorName(color)}
          </span>
        </div>
      ))}
    </div>
  );
};

// Helper function to determine text color based on background color contrast
const getContrastColor = (hexColor: string): "black" | "white" => {
  // Remove the hash if it exists
  const color = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16) || 0;
  const g = parseInt(color.substr(2, 2), 16) || 0;
  const b = parseInt(color.substr(4, 2), 16) || 0;

  // Calculate luminance - using the relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors and white for dark colors
  return luminance > 0.5 ? "black" : "white";
};

// Color mapping dictionary for common hex colors
const colorNameMap: Record<string, string> = {
  "#000000": "Black",
  "#FFFFFF": "White",
  "#FF0000": "Red",
  "#00FF00": "Green",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#00FFFF": "Cyan",
  "#FF00FF": "Magenta",
  "#C0C0C0": "Silver",
  "#808080": "Gray",
  "#800000": "Maroon",
  "#808000": "Olive",
  "#008000": "Dark Green",
  "#800080": "Purple",
  "#008080": "Teal",
  "#000080": "Navy",
  "#FFA500": "Orange",
  "#A52A2A": "Brown",
  "#FFC0CB": "Pink",
  "#FFD700": "Gold",
  "#E6E6FA": "Lavender",
  "#F5F5DC": "Beige",
  "#D3D3D3": "Light Gray",
  "#2F4F4F": "Dark Slate Gray",
  "#FFFAF0": "Floral White",
  "#F0F8FF": "Alice Blue",
  "#F0FFF0": "Honeydew",
  "#F5FFFA": "Mint Cream",
  "#708090": "Slate Gray",
  "#778899": "Light Slate Gray",
  "#B0C4DE": "Light Steel Blue",
  "#4682B4": "Steel Blue",
  "#87CEEB": "Sky Blue",
  "#ADD8E6": "Light Blue",
  "#AFEEEE": "Pale Turquoise",
  "#E0FFFF": "Light Cyan",
  "#90EE90": "Light Green",
  "#98FB98": "Pale Green",
  "#F0E68C": "Khaki",
  "#FFE4B5": "Moccasin",
  "#FFDEAD": "Navajo White",
  "#D2B48C": "Tan",
  "#CD853F": "Peru",
  "#DAA520": "Goldenrod",
};

// Helper function to format color name for display
const formatColorName = (color: string): string => {
  // Normalize hex color (ensure uppercase and has #)
  const normalizedColor = color.startsWith("#")
    ? color.toUpperCase()
    : `#${color.toUpperCase()}`;

  // Check if it's in our color map
  if (colorNameMap[normalizedColor]) {
    return colorNameMap[normalizedColor];
  }

  // For hex colors not in our map, we could try to find the closest match
  // or just display a formatted version
  if (color.startsWith("#")) {
    return `Color ${color.slice(1, 7)}`;
  }

  // Convert camelCase or kebab-case to readable format
  return color
    .replace(/([A-Z])/g, " $1") // camelCase to spaces
    .replace(/-/g, " ") // kebab-case to spaces
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
};

export default ProductColorSelector;
