"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CheckoutFormData } from "@/types/product_types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

/**
 * AddAddress component - Handles user address creation and management
 * Provides a form interface for users to input their delivery address information
 * Supports multiple address types through a tabbed interface
 */
export default function AddAddress() {
  // User session for authentication and user identification
  const { data: session } = useSession();

  // Form submission state tracking
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("home");

  // Form data state with typed interface matching the backend expectations
  const [userData, setUserData] = useState<Partial<CheckoutFormData>>({
    city: "",
    phone: "",
    deliver_to: "",
    ghana_post: "",
    street: "",
    region: "",
    email: session?.user?.email || "",
    name: session?.user?.name || "",
  });

  // Hook for profile operations including address creation
  const { createUserProfile } = useProfile();

  /**
   * Handle form submission
   * Prevents default form behavior, validates required fields,
   * and submits data to the backend through the useProfile hook
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Form validation - ensure required fields are filled
    if (!userData.phone || !userData.region || !userData.city) {
      toast.error("Please fill all required fields", {
        description: "Phone, region and city are required",
        duration: 3000,
      });
      return;
    }

    // Format data for submission
    const addressType = activeTab;
    const formData: CheckoutFormData = {
      ...(userData as CheckoutFormData),
      user_id: session?.user?.id || "",
      id: "", // Will be assigned by the backend
      deliver_to: addressType,
    };

    setIsSubmitting(true);

    try {
      // Submit address data to server
      await createUserProfile.mutateAsync(formData);

      toast.success("Address added successfully", {
        description: `Your ${addressType} address has been saved`,
        duration: 3000,
      });

      // Reset form after successful submission
      setUserData({
        ...userData,
        city: "",
        street: "",
        ghana_post: "",
      });
    } catch (error) {
      // Detailed error handling with specific error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save your address. Please try again later.";

      toast.error("Address submission failed", {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle input field changes
   * Updates the form state with the new values as the user types
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handle select field changes (for dropdown selections like regions)
   */
  const handleSelectChange = (value: string, name: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handle tab change for different address types
   */
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setUserData((prev) => ({
      ...prev,
      deliver_to: value,
    }));
  };

  // List of regions in Ghana for the dropdown selection
  const ghanaRegions = [
    "Greater Accra",
    "Ashanti",
    "Western",
    "Eastern",
    "Central",
    "Northern",
    "Upper East",
    "Upper West",
    "Volta",
    "Bono",
    "Bono East",
    "Ahafo",
    "Western North",
    "Oti",
    "North East",
    "Savannah",
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Manage Your Addresses</h2>

      {/* Address type tabs */}
      <Tabs
        defaultValue="home"
        className="mb-6"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="home">Home Address</TabsTrigger>
          <TabsTrigger value="work">Work Address</TabsTrigger>
          <TabsTrigger value="other">Other Address</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-4">
          <p className="text-muted-foreground mb-4">
            Enter your home address details for deliveries
          </p>
        </TabsContent>

        <TabsContent value="work" className="mt-4">
          <p className="text-muted-foreground mb-4">
            Enter your work address details for deliveries
          </p>
        </TabsContent>

        <TabsContent value="other" className="mt-4">
          <p className="text-muted-foreground mb-4">
            Enter any other address details for deliveries
          </p>
        </TabsContent>
      </Tabs>

      {/* Address form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name field */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={userData.name || ""}
              required
              placeholder="Enter your full name"
              onChange={handleChange}
            />
          </div>

          {/* Phone number field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              name="phone"
              value={userData.phone || ""}
              required
              placeholder="Enter your phone number"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Region selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "region")}
              value={userData.region || ""}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your region" />
              </SelectTrigger>
              <SelectContent>
                {ghanaRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City field */}
          <div className="space-y-2">
            <Label htmlFor="city">City/Town</Label>
            <Input
              id="city"
              type="text"
              name="city"
              value={userData.city || ""}
              required
              placeholder="Enter your city or town"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Street address field */}
        <div className="space-y-2">
          <Label htmlFor="streetAddress">Street Address</Label>
          <Input
            id="streetAddress"
            type="text"
            name="street"
            value={userData.street || ""}
            placeholder="Enter your street address"
            onChange={handleChange}
          />
        </div>

        {/* Ghana Post GPS address field */}
        <div className="space-y-2">
          <Label htmlFor="ghana_post">
            Ghana Post GPS Address (optional)
            <span className="ml-2 text-xs text-muted-foreground">
              Format: GA-123-4567
            </span>
          </Label>
          <Input
            id="ghana_post"
            type="text"
            name="ghana_post"
            value={userData.ghana_post || ""}
            placeholder="Enter your Ghana Post GPS address (e.g., GA-123-4567)"
            onChange={handleChange}
          />
        </div>

        {/* Additional instructions field */}
        <div className="space-y-2">
          <Label htmlFor="additionalInstructions">
            Additional Delivery Instructions
          </Label>
          <Input
            id="additionalInstructions"
            type="text"
            name="additionalInstructions"
            value={userData.deliver_to || ""}
            placeholder="Enter any additional delivery instructions"
            onChange={handleChange}
          />
        </div>

        {/* Submit button with loading state */}
        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Address...
            </>
          ) : (
            "Save Address"
          )}
        </Button>
      </form>
    </div>
  );
}
