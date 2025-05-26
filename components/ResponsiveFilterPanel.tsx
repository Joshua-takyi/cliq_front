"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { ProductProps } from "@/types/product_types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

/**
 * ResponsiveFilterPanel component that adapts to different screen sizes
 * Displays as a slide-in panel on mobile and as an expanded sidebar on desktop
 * All filters are collapsible for better space management
 */
export default function ResponsiveFilterPanel({
  isOpen,
  onClose,
  onToggle,
}: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const panelRef = useRef<HTMLDivElement>(null);

  // State for filter values
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // State for filter sections visibility
  const [expandedSections, setExpandedSections] = useState<{
    colors: boolean;
    models: boolean;
    tags: boolean;
    price: boolean;
  }>({
    colors: true,
    models: false,
    tags: false,
    price: true,
  });

  // Get all available options for filters
  const { data: allProductsData } = useProduct().filterProducts({}, 100, 1);
  const allProducts =
    allProductsData?.data?.products || allProductsData?.products || [];

  // Extract unique colors, models, tags and price range from products
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);

  // State for active filters count (for mobile badge)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Initialize filters from URL params
  useEffect(() => {
    // Parse URL params for initial filter state
    const colorsParam = searchParams.get("colors");
    const modelsParam = searchParams.get("models");
    const tagsParam = searchParams.get("tags");
    const minPriceParam = searchParams.get("min_price");
    const maxPriceParam = searchParams.get("max_price");

    if (colorsParam) {
      setSelectedColors(colorsParam.split(","));
    }

    if (modelsParam) {
      setSelectedModels(modelsParam.split(","));
    }

    if (tagsParam) {
      setSelectedTags(tagsParam.split(","));
    }

    if (minPriceParam && maxPriceParam) {
      setPriceRange([Number(minPriceParam), Number(maxPriceParam)]);
    }

    // Calculate active filters
    let activeCount = 0;
    if (colorsParam) activeCount++;
    if (modelsParam) activeCount++;
    if (tagsParam) activeCount++;
    if (minPriceParam || maxPriceParam) activeCount++;

    setActiveFiltersCount(activeCount);
  }, [searchParams]);

  // Extract unique colors, models, tags and price range from products
  useEffect(() => {
    if (allProducts.length > 0) {
      // Extract and deduplicate colors, models, tags
      const colors = new Set<string>();
      const models = new Set<string>();
      const tags = new Set<string>();
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

        // Extract tags
        if (product.tags && Array.isArray(product.tags)) {
          product.tags.forEach((tag) => tags.add(tag));
        }

        // Track min/max price
        if (product.price < min) min = product.price;
        if (product.price > max) max = product.price;
      });

      setAvailableColors(Array.from(colors));
      setAvailableModels(Array.from(models));
      setAvailableTags(Array.from(tags));

      // Set min/max price with some padding
      setPriceMin(Math.floor(min));
      setPriceMax(Math.ceil(max));

      // Initialize price range if not already set from URL
      if (priceRange[0] === 0 && priceRange[1] === 1000) {
        setPriceRange([Math.floor(min), Math.ceil(max)]);
      }
    }
  }, [allProducts]);

  // Handle click outside to close the panel on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        isOpen &&
        window.innerWidth < 768
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Toggle filter section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
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

    // Update or remove tag parameters
    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    } else {
      params.delete("tags");
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

    // Calculate active filters count for badge
    let activeCount = 0;
    if (selectedColors.length > 0) activeCount++;
    if (selectedModels.length > 0) activeCount++;
    if (selectedTags.length > 0) activeCount++;
    if (priceRange[0] > priceMin || priceRange[1] < priceMax) activeCount++;

    setActiveFiltersCount(activeCount);

    // Build the new URL with updated filters
    const path = window.location.pathname;
    const newUrl = `${path}?${params.toString()}`;

    // Navigate to the updated URL
    router.push(newUrl);

    // Close the filter panel on mobile only
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedModels([]);
    setSelectedTags([]);
    setPriceRange([priceMin, priceMax]);
    setActiveFiltersCount(0);

    // Create a new URLSearchParams object from the current search params but remove filter params
    const params = new URLSearchParams(searchParams.toString());
    params.delete("colors");
    params.delete("models");
    params.delete("tags");
    params.delete("min_price");
    params.delete("max_price");
    params.set("page", "1");

    // Build the new URL without filters
    const path = window.location.pathname;
    const newUrl = `${path}?${params.toString()}`;

    // Navigate to the updated URL
    router.push(newUrl);
  };

  // Filter section component with expandable/collapsible behavior
  const FilterSection = ({
    title,
    id,
    isExpanded,
    onToggle,
    children,
  }: {
    title: string;
    id: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => {
    return (
      <div className="border-b border-gray-200 py-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={onToggle}
        >
          <h3 className="font-medium text-sm">{title}</h3>
          <button className="text-gray-500">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        {isExpanded && <div className="mt-3 space-y-2 pl-1">{children}</div>}
      </div>
    );
  };

  // Color filter item with color swatch
  const ColorFilterItem = ({ color }: { color: string }) => {
    // Generate a background color based on the color name
    const getColorCode = (colorName: string) => {
      // This is a simple mapping of common color names to hex codes
      // In a real app, you might want to have a more comprehensive mapping
      const colorMap: Record<string, string> = {
        red: "#f44336",
        blue: "#2196f3",
        green: "#4caf50",
        yellow: "#ffeb3b",
        purple: "#9c27b0",
        pink: "#e91e63",
        orange: "#ff9800",
        brown: "#795548",
        black: "#000000",
        white: "#ffffff",
        gray: "#9e9e9e",
        silver: "#c0c0c0",
        gold: "#ffd700",
      };

      return colorMap[colorName.toLowerCase()] || "#cccccc";
    };

    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={selectedColors.includes(color)}
          onChange={() => toggleColor(color)}
          className="sr-only" // Hide the default checkbox
        />
        <div className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full border ${
              selectedColors.includes(color)
                ? "border-black ring-2 ring-gray-200"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: getColorCode(color) }}
          />
          <span className="ml-2 text-sm capitalize">{color}</span>
        </div>
      </label>
    );
  };

  return (
    <>
      {/* Mobile filter button with badge */}
      <div className="md:hidden">
        <button
          onClick={onToggle}
          className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 relative"
          aria-label="Toggle filters"
        >
          <Filter size={16} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop persistent filter panel */}
      <div className="hidden md:block w-64 pr-6">
        <div className="sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-black"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Color filter section */}
          <FilterSection
            title="Colors"
            id="colors"
            isExpanded={expandedSections.colors}
            onToggle={() => toggleSection("colors")}
          >
            <div className="grid grid-cols-1 gap-2">
              {availableColors.map((color) => (
                <ColorFilterItem key={color} color={color} />
              ))}
            </div>
          </FilterSection>

          {/* Models filter section */}
          <FilterSection
            title="Models"
            id="models"
            isExpanded={expandedSections.models}
            onToggle={() => toggleSection("models")}
          >
            <div className="grid grid-cols-1 gap-2">
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
          </FilterSection>

          {/* Tags filter section */}
          <FilterSection
            title="Tags"
            id="tags"
            isExpanded={expandedSections.tags}
            onToggle={() => toggleSection("tags")}
          >
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 text-xs rounded-full ${
                    selectedTags.includes(tag)
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Price range filter section */}
          <FilterSection
            title="Price Range"
            id="price"
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection("price")}
          >
            <div className="px-2 pt-4">
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
          </FilterSection>

          {/* Apply filters button (desktop) */}
          <div className="mt-6">
            <button
              onClick={applyFilters}
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter panel as a slide-in drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={onClose}
            />

            {/* Slide-in panel */}
            <motion.div
              ref={panelRef}
              className="md:hidden fixed right-0 top-0 z-50 h-full w-[85%] max-w-[350px] bg-white shadow-lg overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="p-5">
                {/* Header with close button */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Filters</h2>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile filters content - reuse the same sections as desktop */}
                <div className="space-y-1">
                  {/* Color filter section */}
                  <FilterSection
                    title="Colors"
                    id="colors-mobile"
                    isExpanded={expandedSections.colors}
                    onToggle={() => toggleSection("colors")}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {availableColors.map((color) => (
                        <ColorFilterItem key={color} color={color} />
                      ))}
                    </div>
                  </FilterSection>

                  {/* Models filter section */}
                  <FilterSection
                    title="Models"
                    id="models-mobile"
                    isExpanded={expandedSections.models}
                    onToggle={() => toggleSection("models")}
                  >
                    <div className="grid grid-cols-2 gap-2">
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
                  </FilterSection>

                  {/* Tags filter section */}
                  <FilterSection
                    title="Tags"
                    id="tags-mobile"
                    isExpanded={expandedSections.tags}
                    onToggle={() => toggleSection("tags")}
                  >
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            selectedTags.includes(tag)
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Price range filter section */}
                  <FilterSection
                    title="Price Range"
                    id="price-mobile"
                    isExpanded={expandedSections.price}
                    onToggle={() => toggleSection("price")}
                  >
                    <div className="px-2 pt-4">
                      <Slider
                        range
                        min={priceMin}
                        max={priceMax}
                        value={priceRange}
                        onChange={(value) =>
                          setPriceRange(value as [number, number])
                        }
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
                  </FilterSection>
                </div>

                {/* Filter actions for mobile */}
                <div className="mt-8 space-y-3 pb-6">
                  <button
                    onClick={applyFilters}
                    className="w-full py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="w-full py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
