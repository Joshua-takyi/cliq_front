"use client";

import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Define interface for filter state specific to phone accessories business
interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  models: string; // Phone models - most important for phone accessories
  colors: string;
  materials: string;
  brands: string; // Accessory brands
  compatibility: string; // Compatibility features like MagSafe, wireless charging
  sortBy: string;
  sortDir: string;
  isAvailable: boolean | null;
  isNew: boolean | null;
  isOnSale: boolean | null;
  isFeatured: boolean | null;
  isBestSeller: boolean | null;
  isWireless: boolean | null; // For wireless accessories
  isFastCharging: boolean | null; // For charging accessories
  isMagSafe: boolean | null; // For MagSafe compatible accessories
  isWaterproof: boolean | null; // For protective accessories
}

// Comprehensive filter options tailored for phone accessories business
const FILTER_OPTIONS = {
  // Phone accessory categories - covering all major product types customers search for
  categories: [
    "Phone Cases and Covers",
    "Screen Protectors and Privacy Films",
    "Chargers and Charging Cables",
    "Wireless Chargers and Stands",
    "Power Banks and Portable Chargers",
    "Phone Holders and Car Mounts",
    "Headphones and Wireless Earbuds",
    "Phone Camera Accessories",
    "Phone Grips and Pop Sockets",
    "Phone Cleaning and Maintenance",
    "Selfie Sticks and Phone Tripods",
    "Phone Straps and Lanyards",
  ],

  // Comprehensive phone model list - organized by brand popularity and current market
  phoneModels: [
    // iPhone models (most popular in accessories market)
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13 Mini",
    "iPhone 13",
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12 Mini",
    "iPhone 12",
    "iPhone SE (3rd Generation)",
    "iPhone 11",

    // Samsung Galaxy models (second most popular)
    "Samsung Galaxy S24 Ultra",
    "Samsung Galaxy S24+",
    "Samsung Galaxy S24",
    "Samsung Galaxy S23 Ultra",
    "Samsung Galaxy S23+",
    "Samsung Galaxy S23",
    "Samsung Galaxy S22 Ultra",
    "Samsung Galaxy S22+",
    "Samsung Galaxy S22",
    "Samsung Galaxy Note 20 Ultra",
    "Samsung Galaxy A54 5G",
    "Samsung Galaxy A34 5G",
    "Samsung Galaxy A24",

    // Google Pixel models
    "Google Pixel 8 Pro",
    "Google Pixel 8",
    "Google Pixel 7 Pro",
    "Google Pixel 7",
    "Google Pixel 6 Pro",
    "Google Pixel 6a",

    // Other popular Android brands
    "OnePlus 12",
    "OnePlus 11",
    "OnePlus 10 Pro",
    "Xiaomi 14 Ultra",
    "Xiaomi 14",
    "Xiaomi 13",
    "Nothing Phone (2)",
    "Nothing Phone (1)",
    "Huawei P60 Pro",
    "Oppo Find X6 Pro",
    "Vivo X100 Pro",

    // Universal compatibility option
    "Universal (Fits Most Phones)",
  ],

  // Popular colors for phone accessories
  colors: [
    "Clear/Transparent",
    "Black",
    "White",
    "Navy Blue",
    "Royal Blue",
    "Sky Blue",
    "Red",
    "Dark Red",
    "Pink",
    "Hot Pink",
    "Purple",
    "Lavender",
    "Green",
    "Dark Green",
    "Yellow",
    "Orange",
    "Gold",
    "Rose Gold",
    "Silver",
    "Space Gray",
    "Midnight",
    "Brown",
    "Tan",
    "Multi-Color",
    "Rainbow",
  ],

  // Materials commonly used in phone accessories
  materials: [
    "TPU (Flexible Plastic)",
    "Silicone",
    "Hard Plastic (PC)",
    "Genuine Leather",
    "PU Leather (Vegan)",
    "Metal/Aluminum",
    "Tempered Glass",
    "Carbon Fiber",
    "Fabric/Canvas",
    "Rubber",
    "Wood",
    "Bamboo",
    "Hybrid (TPU + PC)",
    "Liquid Silicone",
  ],

  // Popular accessory brands that customers search for
  //   brands: [
  //     "OtterBox",
  //     "Spigen",
  //     "UAG (Urban Armor Gear)",
  //     "Belkin",
  //     "Anker",
  //     "ESR",
  //     "ZAGG",
  //     "PopSocket",
  //     "Moft",
  //     "Peak Design",
  //     "Apple",
  //     "Samsung",
  //     "Case-Mate",
  //     "Incipio",
  //     "Tech21",
  //     "Nomad",
  //     "Bellroy",
  //     "Ringke",
  //     "Generic/Unbranded",
  //   ],

  // Compatibility features and special functionality
  compatibility: [
    "MagSafe Compatible",
    "Qi Wireless Charging",
    "Fast Charging Support",
    "USB-C Compatible",
    "Lightning Compatible",
    "Waterproof (IP67/IP68)",
    "Drop Protection",
    "Anti-Fingerprint Coating",
    "Anti-Glare Treatment",
    "Blue Light Filter",
    "Privacy Screen",
    "Card Holder Slot",
    "Kickstand Function",
    "Camera Lens Protection",
    "Magnetic Mount Ready",
  ],

  // Sorting options optimized for e-commerce conversion
  sortOptions: [
    { value: "relevance", label: "Most Relevant" },
    { value: "price_low_high", label: "Price: Low to High" },
    { value: "price_high_low", label: "Price: High to Low" },
    { value: "newest", label: "Newest Arrivals" },
    { value: "best_selling", label: "Best Sellers" },
    { value: "highest_rated", label: "Customer Rating" },
    { value: "most_reviewed", label: "Most Reviews" },
    { value: "name_a_z", label: "Name: A to Z" },
    { value: "name_z_a", label: "Name: Z to A" },
    { value: "discount", label: "Biggest Discounts" },
  ],
};

export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filter state from URL parameters - comprehensive state management for phone accessories
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("min_price") || "",
    maxPrice: searchParams.get("max_price") || "",
    models: searchParams.get("models") || "", // Phone models - primary filter for accessories
    colors: searchParams.get("colors") || "",
    materials: searchParams.get("materials") || "",
    brands: searchParams.get("brands") || "", // Accessory brands
    compatibility: searchParams.get("compatibility") || "", // Special features
    sortBy: searchParams.get("sort_by") || "",
    sortDir: searchParams.get("sort_dir") || "asc",
    isAvailable:
      searchParams.get("is_available") === "true"
        ? true
        : searchParams.get("is_available") === "false"
        ? false
        : null,
    isNew:
      searchParams.get("is_new") === "true"
        ? true
        : searchParams.get("is_new") === "false"
        ? false
        : null,
    isOnSale:
      searchParams.get("is_on_sale") === "true"
        ? true
        : searchParams.get("is_on_sale") === "false"
        ? false
        : null,
    isFeatured:
      searchParams.get("is_featured") === "true"
        ? true
        : searchParams.get("is_featured") === "false"
        ? false
        : null,
    isBestSeller:
      searchParams.get("is_best_seller") === "true"
        ? true
        : searchParams.get("is_best_seller") === "false"
        ? false
        : null,
    isWireless:
      searchParams.get("is_wireless") === "true"
        ? true
        : searchParams.get("is_wireless") === "false"
        ? false
        : null,
    isFastCharging:
      searchParams.get("is_fast_charging") === "true"
        ? true
        : searchParams.get("is_fast_charging") === "false"
        ? false
        : null,
    isMagSafe:
      searchParams.get("is_magsafe") === "true"
        ? true
        : searchParams.get("is_magsafe") === "false"
        ? false
        : null,
    isWaterproof:
      searchParams.get("is_waterproof") === "true"
        ? true
        : searchParams.get("is_waterproof") === "false"
        ? false
        : null,
  });

  // Accordion state for organizing filter sections - prioritized for phone accessories shopping experience
  const [accordionState, setAccordionState] = useState({
    phoneModel: true, // Most important filter - users search by phone model first
    category: true, // Second most important - type of accessory
    price: true, // Always important for customers
    features: false, // Advanced filters - initially collapsed to reduce cognitive load
    brand: false, // Brand preferences - secondary consideration
    specifications: false, // Technical details - for power users
    sort: true, // Sorting options - important for browsing
  });

  // Update URL parameters when filters change - optimized for SEO and shareable URLs
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();

    // Only add parameters that have values to keep URLs clean and SEO-friendly
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        // Convert camelCase to snake_case for API consistency
        const paramKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        params.set(paramKey, String(value));
      }
    });

    // Always reset to page 1 when filters change to avoid empty results
    params.set("page", "1");

    // Update URL without causing page reload for smooth user experience
    const newURL = `${window.location.pathname}?${params.toString()}`;
    router.push(newURL, { scroll: false });
  };

  // Handle filter changes with immediate URL update for responsive filtering
  const handleFilterChange = (
    key: keyof FilterState,
    value: string | boolean | null
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  // Clear all filters and reset to default state
  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      category: "",
      minPrice: "",
      maxPrice: "",
      models: "",
      colors: "",
      materials: "",
      brands: "",
      compatibility: "",
      sortBy: "",
      sortDir: "asc",
      isAvailable: null,
      isNew: null,
      isOnSale: null,
      isFeatured: null,
      isBestSeller: null,
      isWireless: null,
      isFastCharging: null,
      isMagSafe: null,
      isWaterproof: null,
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  // Toggle accordion sections for better mobile experience and clean UI
  const toggleAccordion = (section: keyof typeof accordionState) => {
    setAccordionState((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Count active filters for user feedback and clear button display
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(
      (value) => value !== "" && value !== null && value !== undefined
    ).length;
  };

  return (
    <div className=" border border-gray-200 rounded-none  p-4 w-full">
      {/* Minimalistic filter header with compact design */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center text-xs text-red-600 hover:text-red-800 transition-colors"
          >
            <X className="h-3 w-3 mr-1" />
            Clear ({getActiveFilterCount()})
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Phone Model Filter - Most Important for Phone Accessories */}
        <div className="border-b border-gray-50 pb-3">
          <button
            onClick={() => toggleAccordion("phoneModel")}
            className="flex items-center justify-between w-full text-left py-1"
          >
            <h3 className="text-xs font-medium text-gray-900">Phone Model</h3>
            <ChevronDown
              className={`h-3 w-3 text-gray-500 transition-transform ${
                accordionState.phoneModel ? "rotate-180" : ""
              }`}
            />
          </button>

          {accordionState.phoneModel && (
            <div className="mt-2 transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in">
              <select
                value={filters.models}
                onChange={(e) => handleFilterChange("models", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-none text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">All Models</option>
                {FILTER_OPTIONS.phoneModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Category Filter - Type of Accessory */}
        <div className="border-b border-gray-50 pb-3">
          <button
            onClick={() => toggleAccordion("category")}
            className="flex items-center justify-between w-full text-left py-1"
          >
            <h3 className="text-xs font-medium text-gray-900">Category</h3>
            <ChevronDown
              className={`h-3 w-3 text-gray-500 transition-transform ${
                accordionState.category ? "rotate-180" : ""
              }`}
            />
          </button>

          {accordionState.category && (
            <div className="mt-2">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-none text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">All Categories</option>
                {FILTER_OPTIONS.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Sort Options - Essential for e-commerce browsing */}
        <div className="border-b border-gray-50 pb-3">
          <button
            onClick={() => toggleAccordion("sort")}
            className="flex items-center justify-between w-full text-left py-1"
          >
            <h3 className="text-xs font-medium text-gray-900">Sort</h3>
            <ChevronDown
              className={`h-3 w-3 text-gray-500 transition-transform ${
                accordionState.sort ? "rotate-180" : ""
              }`}
            />
          </button>

          {accordionState.sort && (
            <div className="mt-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-none text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Default</option>
                {FILTER_OPTIONS.sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Material & Color Specifications - For detailed filtering */}
        <div className="border-b border-gray-50 pb-3">
          <button
            onClick={() => toggleAccordion("specifications")}
            className="flex items-center justify-between w-full text-left py-1"
          >
            <h3 className="text-xs font-medium text-gray-900">Colors</h3>
            <ChevronDown
              className={`h-3 w-3 text-gray-500 transition-transform ${
                accordionState.specifications ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="mt-2 space-y-2">
            {/* Color Filter - Compact dropdown */}
            <select
              value={filters.colors}
              onChange={(e) => handleFilterChange("colors", e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded-none text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">All Colors</option>
              {FILTER_OPTIONS.colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Minimal filter summary - only show when filters are active */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            {getActiveFilterCount()} filter
            {getActiveFilterCount() !== 1 ? "s" : ""} active
          </p>
        </div>
      )}
    </div>
  );
}
