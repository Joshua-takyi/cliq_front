"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FormWrapper } from "@/components/formWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin?callbackUrl=/profile");
    },
  });

  // User delivery details state
  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ")[1] || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    region: "",
    ghanaPostGPS: "",
    landmark: "",
    deliveryInstructions: "",
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Here you would make an API call to save the delivery details
      // For now, we'll just show a success message
      toast.success("Delivery details updated successfully!");

      // In a real application, you would save this data to your backend
      // Example: await fetch('/api/user/delivery-details', { method: 'POST', body: JSON.stringify(formData) })
    } catch (error) {
      // Detailed error message as per instructions
      toast.error(
        "Failed to update delivery details. The server could not process your request. Please try again later or contact support if the issue persists."
      );
      console.error("Error updating delivery details:", error);
    }
  };

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Details</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-4">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user?.name || "User"}
                  className="h-24 w-24 rounded-full"
                />
              )}
              <div className="mt-4 md:mt-0">
                <h2 className="text-2xl font-medium">{session.user?.name}</h2>
                <p className="text-gray-600">{session.user?.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  User ID: {session.user?.id}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      session.user?.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : session.user?.role === "editor"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    Role: {session.user?.role || "user"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="delivery">
          <FormWrapper
            title="Delivery Information"
            description="Please provide your delivery details for a smooth shopping experience."
            onSubmit={handleSubmit}
          >
            {/* Personal Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your street address"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="city">City/Town</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city or town"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Enter your region"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="ghanaPostGPS">Ghana Post GPS Address</Label>
                  <Input
                    id="ghanaPostGPS"
                    name="ghanaPostGPS"
                    value={formData.ghanaPostGPS}
                    onChange={handleChange}
                    placeholder="e.g., GA-123-4567"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark for easy location"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="deliveryInstructions">
                    Delivery Instructions (Optional)
                  </Label>
                  <textarea
                    id="deliveryInstructions"
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    placeholder="Any special instructions for delivery"
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs file:inline-flex"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button type="submit" size="lg">
                Save Delivery Details
              </Button>
            </div>
          </FormWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
}
