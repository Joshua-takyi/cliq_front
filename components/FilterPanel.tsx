"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { useSearchParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { ProductProps } from "@/types/product_types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filter values
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Get all available options for filters
  const { data: allProductsData } = useProduct().filterProducts({}, 100, 1);
  const allProducts =
    allProductsData?.data?.products || allProductsData?.products || [];

  // Extract unique colors and models from products
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);

  // Initialize filters from URL params
  useEffect(() => {
    // Parse URL params for initial filter state
    const colorsParam = searchParams.get("colors");
    const modelsParam = searchParams.get("models");
    const minPriceParam = searchParams.get("min_price");
    const maxPriceParam = searchParams.get("max_price");

    if (colorsParam) {
      setSelectedColors(colorsParam.split(","));
    }

    if (modelsParam) {
      setSelectedModels(modelsParam.split(","));
    }

    if (minPriceParam && maxPriceParam) {
      setPriceRange([Number(minPriceParam), Number(maxPriceParam)]);
    }
  }, [searchParams]);

  // Extract unique colors and models and price range from products
  useEffect(() => {
    if (allProducts.length > 0) {
      // Extract and deduplicate colors
      const colors = new Set<string>();
      const models = new Set<string>();
      let min = Number.MAX_VALUE;
      let max = 0;

      allProducts.forEach((product: ProductProps) => {
        // Extract colors
        if (product.colors && Array.isArray(product.colors)) {
          product.colors.forEach((color) => colors.add(color));
        }

        // Extract models
        if (product.models && Array.isArray(product.models)) {
          product.models.forEach((model) => models.add(model));
        }

        // Track min/max price
        if (product.price < min) min = product.price;
        if (product.price > max) max = product.price;
      });

      setAvailableColors(Array.from(colors));
      setAvailableModels(Array.from(models));

      // Set min/max price with some padding
      setPriceMin(Math.floor(min));
      setPriceMax(Math.ceil(max));

      // Initialize price range if not already set from URL
      if (priceRange[0] === 0 && priceRange[1] === 1000) {
        setPriceRange([Math.floor(min), Math.ceil(max)]);
      }
    }
  }, [allProducts]);

  // Handle color toggle
  const toggleColor = (color: string) => {
    setSelectedColors((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  // Handle model toggle
  const toggleModel = (model: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(model)) {
        return prev.filter((m) => m !== model);
      } else {
        return [...prev, model];
      }
    });
  };

  // Apply filters
  const applyFilters = () => {
    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove color parameters
    if (selectedColors.length > 0) {
      params.set("colors", selectedColors.join(","));
    } else {
      params.delete("colors");
    }

    // Update or remove model parameters
    if (selectedModels.length > 0) {
      params.set("models", selectedModels.join(","));
    } else {
      params.delete("models");
    }

    // Update price range parameters
    if (priceRange[0] > priceMin) {
      params.set("min_price", priceRange[0].toString());
    } else {
      params.delete("min_price");
    }

    if (priceRange[1] < priceMax) {
      params.set("max_price", priceRange[1].toString());
    } else {
      params.delete("max_price");
    }

    // Keep the page at 1 when applying new filters
    params.set("page", "1");

    // Build the new URL with updated filters
    const path = window.location.pathname;
    const newUrl = `${path}?${params.toString()}`;

    // Navigate to the updated URL
    router.push(newUrl);

    // Close the filter panel on mobile
    onClose();
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedModels([]);
    setPriceRange([priceMin, priceMax]);

    // Create a new URLSearchParams object from the current search params but remove filter params
    const params = new URLSearchParams(searchParams.toString());
    params.delete("colors");
    params.delete("models");
    params.delete("min_price");
    params.delete("max_price");
    params.set("page", "1");

    // Build the new URL without filters
    const path = window.location.pathname;
    const newUrl = `${path}?${params.toString()}`;

    // Navigate to the updated URL
    router.push(newUrl);
  };

  // Create accordion items for each filter type
  const accordionItems = [
    {
      id: "colors",
      title: "Colors",
      content: (
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => (
            <label
              key={color}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedColors.includes(color)}
                onChange={() => toggleColor(color)}
                className="rounded text-black focus:ring-black h-4 w-4"
              />
              <span className="text-sm capitalize">{color}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      id: "models",
      title: "Models",
      content: (
        <div className="flex flex-wrap gap-2">
          {availableModels.map((model) => (
            <label
              key={model}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedModels.includes(model)}
                onChange={() => toggleModel(model)}
                className="rounded text-black focus:ring-black h-4 w-4"
              />
              <span className="text-sm capitalize">{model}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      id: "price",
      title: "Price Range",
      content: (
        <div className="px-2">
          <Slider
            range
            min={priceMin}
            max={priceMax}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
            trackStyle={[{ backgroundColor: "#000" }]}
            handleStyle={[
              { borderColor: "#000", backgroundColor: "#fff" },
              { borderColor: "#000", backgroundColor: "#fff" },
            ]}
          />
          <div className="flex justify-between mt-4 text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Overlay when filter panel is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter panel */}
      <motion.div
        className={`fixed right-0 top-0 z-50 h-full w-[300px] bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out overflow-y-auto`}
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Filter Products</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          {/* Accordion filters */}
          <Accordion
            items={accordionItems}
            allowMultiple={true}
            defaultOpen="colors"
          />

          {/* Filter actions */}
          <div className="mt-8 flex flex-col space-y-3">
            <button
              onClick={applyFilters}
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
