"use client";

import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";
import { User, Phone, Mail, MapPin, Home, Navigation } from "lucide-react";
import { CheckoutFormData } from "@/types/product_types";
import Loader from "@/app/loading";

export default function PersonalInfoComponent() {
  const { getUserInfo } = useProfile();
  const { data, isLoading, refetch } = getUserInfo;

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Loader />;
  }

  if (!data || data?.length === 0) {
    return (
      <div className="p-6 bg-transparent">
        <h1 className="text-2xl font-bold mb-4">Personal Information</h1>
        <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300">
          <p className="text-gray-500">
            No personal information found. Please add your details.
          </p>
        </div>
      </div>
    );
  }
  return (
    <section className="p-6 bg-transparent">
      <h1 className="text-2xl font-bold mb-6">Personal Information</h1>
      <InfoCard userData={data} />
    </section>
  );
}

// InfoCard component to display user information in a clean, transparent layout
interface InfoCardProps {
  userData: CheckoutFormData;
}

const InfoCard: React.FC<InfoCardProps> = ({ userData }) => {
  // Destructure the user data for easier access
  const { name, email, phone, region, city, street, ghana_post, deliver_to } =
    userData;

  return (
    <div className="flex flex-col gap-6">
      {/* Personal Information Section */}
      <div className="p-6 bg-transparent border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <User className="mr-2 h-5 w-5 text-gray-700" />
          Personal Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Name</span>
            <span className="font-medium">{name || "Not provided"}</span>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="mr-1 h-4 w-4" />
              <span>Email</span>
            </div>
            <span className="font-medium">{email || "Not provided"}</span>
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-gray-500">
              <Phone className="mr-1 h-4 w-4" />
              <span>Phone</span>
            </div>
            <span className="font-medium">{phone || "Not provided"}</span>
          </div>
        </div>
      </div>

      {/* Address Information Section */}
      <div className="p-6 bg-transparent">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Home className="mr-2 h-5 w-5 text-gray-700" />
          Address Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Region */}
          {region && (
            <div className="flex flex-col">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="mr-1 h-4 w-4" />
                <span>Region</span>
              </div>
              <span className="font-medium">{region}</span>
            </div>
          )}

          {/* City */}
          {city && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">City</span>
              <span className="font-medium">{city}</span>
            </div>
          )}

          {/* Street */}
          {street && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Street</span>
              <span className="font-medium">{street}</span>
            </div>
          )}

          {/* Ghana Post */}
          {ghana_post && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Ghana Post</span>
              <span className="font-medium">{ghana_post}</span>
            </div>
          )}

          {/* Delivery Instructions */}
          {deliver_to && (
            <div className="flex flex-col col-span-1 md:col-span-2">
              <div className="flex items-center text-sm text-gray-500">
                <Navigation className="mr-1 h-4 w-4" />
                <span>Delivery Instructions</span>
              </div>
              <span className="font-medium">{deliver_to}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
