"use client";

import { FormCheckbox } from "@/components/checkbox";
import { DynamicList, OptionItem } from "@/components/dynamicList";
import { useProduct } from "@/hooks/useProduct";
import { ProductProps } from "@/types/product_types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { FormImageUpload } from "./cloudinaryUpload";
import { FormWrapper } from "./formWrapper";
import { FormColors } from "./productAddColor";
import { FormInput } from "./productAddInput";

// Predefined product categories to ensure consistency - comprehensive phone accessory categories
const PRODUCT_CATEGORIES: OptionItem[] = [
  { id: "Phone Cases and Covers", name: "Phone Cases and Covers" },
  {
    id: "Screen Protectors and Privacy Films",
    name: "Screen Protectors and Privacy Films",
  },
  { id: "Chargers and Charging Cables", name: "Chargers and Charging Cables" },
  { id: "Wireless Chargers and Stands", name: "Wireless Chargers and Stands" },
  {
    id: "Power Banks and Portable Chargers",
    name: "Power Banks and Portable Chargers",
  },
  { id: "Phone Holders and Car Mounts", name: "Phone Holders and Car Mounts" },
  {
    id: "Headphones and Wireless Earbuds",
    name: "Headphones and Wireless Earbuds",
  },
  { id: "Phone Camera Accessories", name: "Phone Camera Accessories" },
  { id: "Phone Grips and Pop Sockets", name: "Phone Grips and Pop Sockets" },
  {
    id: "Phone Cleaning and Maintenance",
    name: "Phone Cleaning and Maintenance",
  },
  {
    id: "Selfie Sticks and Phone Tripods",
    name: "Selfie Sticks and Phone Tripods",
  },
  { id: "Phone Straps and Lanyards", name: "Phone Straps and Lanyards" },
];

// Predefined product tags for better organization and filtering
const PRODUCT_TAGS: OptionItem[] = [
  { id: "bestseller", name: "Bestseller" },
  { id: "trending", name: "Trending" },
  { id: "apple", name: "Apple Compatible" },
  { id: "samsung", name: "Samsung Compatible" },
  { id: "google", name: "Google Compatible" },
  { id: "wireless", name: "Wireless" },
  { id: "fast charging", name: "Fast Charging" },
  { id: "waterproof", name: "Waterproof" },
  { id: "eco friendly", name: "Eco-Friendly" },
  { id: "premium", name: "Premium" },
  { id: "budget", name: "Budget-Friendly" },
  { id: "durable", name: "Durable" },
  { id: "lightweight", name: "Lightweight" },
  { id: "travel", name: "Travel-Friendly" },
];

// Common device models for consistent reference
const DEVICE_MODELS: OptionItem[] = [
  { id: "iphone 15 pro max", name: "iPhone 15 Pro Max" },
  { id: "iphone 15 pro", name: "iPhone 15 Pro" },
  { id: "iphone 15 plus", name: "iPhone 15 Plus" },
  { id: "iphone 15", name: "iPhone 15" },
  { id: "iphone 14 pro max", name: "iPhone 14 Pro Max" },
  { id: "iphone 14 pro", name: "iPhone 14 Pro" },
  { id: "iphone 14 plus", name: "iPhone 14 Plus" },
  { id: "iphone 14", name: "iPhone 14" },
  { id: "iphone 13 pro max", name: "iPhone 13 Pro Max" },
  { id: "iphone 13 pro", name: "iPhone 13 Pro" },
  { id: "iphone 13", name: "iPhone 13" },
  { id: "samsung s23 ultra", name: "Samsung Galaxy S23 Ultra" },
  { id: "samsung s23 plus", name: "Samsung Galaxy S23+" },
  { id: "samsung s23", name: "Samsung Galaxy S23" },
  { id: "samsung s22 ultra", name: "Samsung Galaxy S22 Ultra" },
  { id: "pixel 8 pro", name: "Google Pixel 8 Pro" },
  { id: "pixel 8", name: "Google Pixel 8" },
  { id: "pixel 7 pro", name: "Google Pixel 7 Pro" },
  { id: "apple watch series 9", name: "Apple Watch Series 9" },
  { id: "apple watch ultra 2", name: "Apple Watch Ultra 2" },
];

// Common materials for accessories
const MATERIAL_OPTIONS: OptionItem[] = [
  { id: "silicone", name: "Silicone" },
  { id: "leather", name: "Leather" },
  { id: "tpu", name: "TPU" },
  { id: "polycarbonate", name: "Polycarbonate" },
  { id: "glass", name: "Tempered Glass" },
  { id: "metal", name: "Metal/Aluminum" },
  { id: "fabric", name: "Fabric" },
  { id: "wood", name: "Wood" },
  { id: "biodegradable", name: "Biodegradable" },
  { id: "carbon fiber", name: "Carbon Fiber" },
];

// Accessory type options for consistency
// const ACCESSORY_TYPE_OPTIONS: OptionItem[] = [
//   { id: "case", name: "Case" },
//   { id: "screen-protector", name: "Screen Protector" },
//   { id: "charger", name: "Charger" },
//   { id: "cable", name: "Cable" },
//   { id: "adapter", name: "Adapter" },
//   { id: "stand", name: "Stand/Holder" },
//   { id: "dock", name: "Dock" },
//   { id: "mount", name: "Mount" },
//   { id: "headphones", name: "Headphones" },
//   { id: "earbuds", name: "Earbuds" },
//   { id: "speaker", name: "Speaker" },
//   { id: "powerbank", name: "Powerbank" },
//   { id: "stylus", name: "Stylus" },
//   { id: "keyboard", name: "Keyboard" },
//   { id: "mouse", name: "Mouse" },
//   { id: "watch-band", name: "Watch Band" },
// ];

interface ProductFormProps {
  initialProduct?: ProductProps;
  isEditMode?: boolean;
}

export default function ProductForm({
  initialProduct,
  isEditMode = false,
}: ProductFormProps) {
  const router = useRouter();
  const { createProduct, updateProduct } = useProduct();

  const queryClient = useQueryClient();
  // Form state with default values or initial product data
  const [formData, setFormData] = useState<ProductProps>({
    id: initialProduct?.id || "",
    title: initialProduct?.title || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price || 0,
    stock: initialProduct?.stock || 0,
    images: initialProduct?.images || [],
    category: initialProduct?.category || [],
    tags: initialProduct?.tags || [], // New field for tags
    colors: initialProduct?.colors || [],
    models: initialProduct?.models || [],
    materials: initialProduct?.materials || [],
    details: initialProduct?.details || [],
    features: initialProduct?.features || [],
    isFeatured: initialProduct?.isFeatured ?? false,
    isNew: initialProduct?.isNew || false,
    isOnSale: initialProduct?.isOnSale || false,
    isBestSeller: initialProduct?.isBestSeller || false, // Added missing field
    warranty: initialProduct?.warranty || 0, // Added missing field
    isAvailable:
      initialProduct?.isAvailable !== undefined
        ? initialProduct.isAvailable
        : true,
    discount: initialProduct?.discount || 0,
    salesStartDate: initialProduct?.salesStartDate || "",
    salesEndDate: initialProduct?.salesEndDate || "",
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // Convert number inputs to numbers
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle checkbox changes for boolean fields
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle adding images
  const handleAddImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrl],
    }));
  };

  // Handle deleting images
  const handleDeleteImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle adding colors
  const handleAddColor = (color: string) => {
    if (!formData.colors.includes(color)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
      }));
    }
  };

  // Handle deleting colors
  const handleDeleteColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  // Generic handler for array fields (categories, models, materials, etc.)
  const handleAddArrayItem = (field: keyof ProductProps, item: string) => {
    setFormData((prev) => {
      const currentArray = Array.isArray(prev[field]) ? prev[field] : [];
      // Store the item (which is now the ID when coming from the dropdown selection)
      if (!currentArray.includes(item)) {
        return { ...prev, [field]: [...currentArray, item] };
      }
      return prev;
    });
  };

  // Generic handler for deleting array items
  const handleDeleteArrayItem = (field: keyof ProductProps, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof ProductProps] as string[]).filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.title.trim()) newErrors.title = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.price <= 0)
      newErrors.price = "Price must be greater than zero";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";

    // Validate URLs in images array against URL pattern to match Zod schema
    const urlPattern =
      /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    } else if (formData.images.some((url) => !urlPattern.test(url))) {
      newErrors.images = "All images must have valid URLs";
    }

    if (formData.category.length === 0)
      newErrors.category = "At least one category is required";
    if (formData.colors.length === 0)
      newErrors.colors = "At least one color is required";
    if ((formData.models ?? []).length === 0)
      newErrors.models = "At least one model is required";
    if (formData.materials.length === 0)
      newErrors.materials = "At least one material is required";

    if (!formData.details || formData.details.length === 0)
      newErrors.details = "At least one detail is required";
    if (formData.features?.length === 0)
      newErrors.features = "At least one feature is required";

    if (formData.stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }
    // Validate dates if product is on sale
    if (formData.isOnSale) {
      if (!formData.salesStartDate)
        newErrors.salesStartDate = "Start date is required for sale items";
      if (!formData.salesEndDate)
        newErrors.salesEndDate = "End date is required for sale items";
      if ((formData.discount ?? 0) <= 0 || (formData.discount ?? 0) > 100) {
        newErrors.discount = "Discount must be between 1 and 100";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorId = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorId);
      if (element)
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure date fields are properly formatted if they exist and product is on sale
      const submissionData = {
        ...formData,
        // Ensure price and other numeric fields are numbers, not strings
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount:
          formData.discount !== undefined ? Number(formData.discount) : 0,
        warranty:
          formData.warranty !== undefined ? Number(formData.warranty) : 0,

        // accessory_type is now handled as a string, not an array

        // Format dates if they exist and product is on sale
        ...(formData.isOnSale && formData.salesStartDate
          ? { salesStartDate: new Date(formData.salesStartDate).toISOString() }
          : {}),
        ...(formData.isOnSale && formData.salesEndDate
          ? { salesEndDate: new Date(formData.salesEndDate).toISOString() }
          : {}),
      };

      // Use different mutations for create vs update
      if (isEditMode) {
        // Handle update separately
        const result = await updateProduct.mutateAsync(submissionData);

        // Check if result exists and has expected structure
        if (result && result.success) {
          toast.success(`Product updated successfully!`);
          router.push("/admin/products");
          queryClient.invalidateQueries({
            queryKey: ["listProducts"],
          });
        } else {
          // If the API returned a response but it indicates failure
          toast.error(
            `Error: ${result?.message || "Failed to update product"}`
          );
          setIsSubmitting(false);
        }
      } else {
        // Handle creation
        const result = await createProduct.mutateAsync(submissionData);

        if (result && result.success) {
          toast.success(`Product saved successfully!`);
          router.push("/admin/products");
        } else {
          toast.error(
            `Error: ${result?.message || "Failed to create product"}`
          );
          setIsSubmitting(false);
        }
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "saving"} product:`,
        error
      );

      // Display more specific error information if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `An error occurred while ${
          isEditMode ? "updating" : "saving"
        } the product`;

      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper
      title={isEditMode ? "Edit Product" : "Add New Product"}
      description={
        isEditMode
          ? "Update the details of your existing product"
          : "Create a new product to add to your store"
      }
      onSubmit={handleSubmit}
      isSubmitting={
        isSubmitting || createProduct.isPending || updateProduct.isPending
      }
    >
      {/* Product ID for edit mode - hidden field */}
      {isEditMode && formData.id && (
        <input type="hidden" name="id" value={formData.id} />
      )}

      {/* Basic Product Information Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <FormInput
              label="Product title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter product title"
              required
              error={errors.title}
            />
          </div>
          <div>
            <FormInput
              label="Price (GHS)"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              required
              type="number"
              step="0.01"
              min="0"
              error={errors.price}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* <div>
            <FormInput
              label="Brand"
              name="brand"
              value={formData.brand || ""}
              onChange={handleInputChange}
              placeholder="Enter brand name"
              error={errors.brand}
            />
          </div> */}
          <div>
            <FormInput
              label="Warranty (Months)"
              name="warranty"
              value={formData.warranty || 0}
              onChange={handleInputChange}
              placeholder="0"
              type="number"
              min="0"
              error={errors.warranty}
            />
          </div>
        </div>

        <FormInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter product description"
          required
          error={errors.description}
        />
      </div>

      {/* Inventory Information Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Inventory & Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <FormInput
              label="Stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="0"
              required
              type="number"
              error={errors.stock}
            />
          </div>
          <div>
            <FormInput
              label="Discount Percentage"
              name="discount"
              value={formData.discount ?? 0}
              onChange={handleInputChange}
              placeholder="0"
              type="number"
              error={errors.discount}
            />
          </div>
        </div>

        {/* Show date fields only if isOnSale is true */}
        {formData.isOnSale && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <FormInput
                label="Sale Start Date"
                name="salesStartDate"
                value={formData.salesStartDate ?? ""}
                onChange={handleInputChange}
                type="date"
                error={errors.salesStartDate}
              />
            </div>
            <div>
              <FormInput
                label="Sale End Date"
                name="salesEndDate"
                value={formData.salesEndDate ?? ""}
                onChange={handleInputChange}
                type="date"
                error={errors.salesEndDate}
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Images Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Product Images
        </h2>
        <FormImageUpload
          images={formData.images}
          onUploadSuccess={handleAddImage}
          onDeleteImage={handleDeleteImage}
          error={errors.images}
        />
      </div>

      {/* Product Status Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Product Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              <FormCheckbox
                label="Featured Product"
                name="isFeatured"
                checked={formData.isFeatured ?? false}
                onChange={(checked) =>
                  handleCheckboxChange("isFeatured", checked)
                }
              />
              <FormCheckbox
                label="New Arrival"
                name="isNew"
                checked={formData.isNew ?? false}
                onChange={(checked) => handleCheckboxChange("isNew", checked)}
              />
              <FormCheckbox
                label="Best Seller"
                name="isBestSeller"
                checked={formData.isBestSeller ?? false}
                onChange={(checked) =>
                  handleCheckboxChange("isBestSeller", checked)
                }
              />
              <FormCheckbox
                label="On Sale"
                name="isOnSale"
                checked={formData.isOnSale ?? false}
                onChange={(checked) =>
                  handleCheckboxChange("isOnSale", checked)
                }
              />
              <FormCheckbox
                label="Available in Stock"
                name="isAvailable"
                checked={formData.isAvailable ?? false}
                onChange={(checked) =>
                  handleCheckboxChange("isAvailable", checked)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Colors Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Product Colors
        </h2>
        <FormColors
          colors={formData.colors}
          onAddColor={handleAddColor}
          onDeleteColor={handleDeleteColor}
          error={errors.colors}
        />
      </div>

      {/* Categories and Tags */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Categories & Tags
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DynamicList
            title="Categories"
            items={formData.category}
            onAddItem={(item) => handleAddArrayItem("category", item)}
            onDeleteItem={(index) => handleDeleteArrayItem("category", index)}
            placeholder="Add a category..."
            error={errors.category}
            options={PRODUCT_CATEGORIES}
            allowCustom={true}
          />

          <DynamicList
            title="Tags"
            items={formData.tags || []}
            onAddItem={(item) => handleAddArrayItem("tags", item)}
            onDeleteItem={(index) => handleDeleteArrayItem("tags", index)}
            placeholder="Add a tag..."
            options={PRODUCT_TAGS}
            allowCustom={true}
          />
        </div>
      </div>

      {/* Product Compatibility */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Product Compatibility
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Replace DynamicList with a proper select dropdown for accessory_type */}

          <DynamicList
            title="Compatible Models"
            items={formData.models || []}
            onAddItem={(item) => handleAddArrayItem("models", item)}
            onDeleteItem={(index) => handleDeleteArrayItem("models", index)}
            placeholder="Add a model..."
            error={errors.models}
            options={DEVICE_MODELS}
            allowCustom={true}
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Product Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DynamicList
            title="Materials"
            items={formData.materials}
            onAddItem={(item) => handleAddArrayItem("materials", item)}
            onDeleteItem={(index) => handleDeleteArrayItem("materials", index)}
            placeholder="Add a material..."
            error={errors.materials}
            options={MATERIAL_OPTIONS}
            allowCustom={true}
          />

          <DynamicList
            title="Features"
            items={formData.features || []}
            onAddItem={(item) => handleAddArrayItem("features", item)}
            onDeleteItem={(index) => handleDeleteArrayItem("features", index)}
            placeholder="Add a feature..."
            error={errors.features}
          />
        </div>

        <div className="mt-8">
          <DynamicList
            title="Details"
            items={formData.details || []}
            onAddItem={(item) => handleAddArrayItem("details", item)}
            onDeleteItem={(index) => handleDeleteArrayItem("details", index)}
            placeholder="Add a detail..."
            error={errors.details}
          />
        </div>
      </div>
    </FormWrapper>
  );
}
