"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ghanaRegions } from "@/-database/db";

export default function AddAddress() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<Partial<CheckoutFormData>>({
    city: "",
    phone: "",
    deliver_to: "",
    ghana_post: "",
    street: "",
    region: "",
  });

  const { createUserProfile } = useProfile();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData.phone || !userData.region || !userData.city) {
      toast.error("Please fill all required fields", {
        description: "Phone, region and city are required",
        duration: 3000,
      });
      return;
    }

    const formData: CheckoutFormData = {
      ...(userData as CheckoutFormData),
      user_id: session?.user?.id || "",
      id: "",
    };

    setIsSubmitting(true);

    try {
      await createUserProfile.mutateAsync(formData);
      toast.success("Address saved successfully!");
      setUserData({
        city: "",
        street: "",
        ghana_post: "",
        phone: "",
        region: "",
        deliver_to: "",
      });
    } catch (error) {
      toast.error("Address submission failed", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Try again.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
        Manage Your Address
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              name="phone"
              required
              value={userData.phone || ""}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="rounded-none h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "region")}
              value={userData.region || ""}
              required
            >
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent className="rounded-none max-h-60 overflow-y-auto">
                {ghanaRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City / Town</Label>
            <Input
              id="city"
              name="city"
              value={userData.city || ""}
              onChange={handleChange}
              required
              placeholder="Enter your city"
              className="rounded-none h-10 "
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              name="street"
              value={userData.street || ""}
              onChange={handleChange}
              placeholder="Street address"
              className="rounded-none h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ghana_post">
            Ghana Post GPS Address{" "}
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            id="ghana_post"
            name="ghana_post"
            value={userData.ghana_post || ""}
            onChange={handleChange}
            placeholder="e.g. GA-123-4567"
            className="rounded-none h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery_address">
            Delivery Address{" "}
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            id="deliver_to"
            name="deliver_to"
            value={userData.deliver_to || ""}
            onChange={handleChange}
            placeholder="e.g. Deliver it to my office"
            className="rounded-none h-10"
          />
        </div>

        <Button
          type="submit"
          className="w-full sm:w-auto sm:px-6 py-2 mt-4 rounded-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Address"
          )}
        </Button>
      </form>
    </div>
  );
}
