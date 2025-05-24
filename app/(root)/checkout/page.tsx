"use client";

import { GHANA_REGIONS } from "@/-database/db";
import { useCheckout } from "@/app/services/checkout";
import CheckoutFormInput from "@/components/CheckoutFormInput";
import ResponsiveLazyImage from "@/components/lazyImage";
import { SimpleShopBreadcrumb } from "@/components/ShopBreadcrumb";
import { Button } from "@/components/ui/button";
import { UseCart } from "@/hooks/useCart";
import { useProfile } from "@/hooks/useProfile";
import { formatPrice } from "@/lib/utils";
import { CheckoutFormData } from "@/types/product_types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { GetCart } = UseCart();
  const { data: cartData, isLoading } = GetCart;
  const session = useSession();
  const { mutate, isPending } = useCheckout();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { getUserInfo } = useProfile();
  const { data: userData, refetch } = getUserInfo;

  const [formData, setFormData] = useState<CheckoutFormData>({
    id: "",
    user_id: "",
    name: "",
    phone: "",
    email: "",
    region: "",
    street: "",
    ghana_post: "",
    city: "",
  });

  // Update form with user profile data when it loads
  // This useEffect will run when userData or session data changes
  useEffect(() => {
    if (userData || session.data?.user) {
      setFormData({
        id: userData?.id || "",
        user_id: session.data?.user?.id || "",
        name: userData?.name || "",
        phone: userData?.phone || "",
        email: session.data?.user?.email || "",
        region: userData?.region || "",
        street: userData?.street || "",
        ghana_post: userData?.ghana_post || "",
        city: userData?.city || "",
      });
    }
  }, [userData, session.data?.user]);

  useEffect(() => {
    // refetch the user data when the component mounts
    refetch();
  });
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data with detailed error messages
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation - required field with meaningful error message
    if (!formData.name.trim()) {
      errors.name = "Full name is required for delivery information";
    }

    // Phone validation - format and required with detailed error message
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required for delivery coordination";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.trim())) {
      errors.phone =
        "Please enter a valid phone number with 10-15 digits (e.g., +233XXXXXXXXX)";
    }

    // Email validation - format and required with helpful error message
    if (!formData.email.trim()) {
      errors.email = "Email address is required for order confirmation";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email =
        "Please enter a valid email address (e.g., name@example.com)";
    }

    // Region validation - required selection with context for why it's needed
    if (!formData.region) {
      errors.region =
        "Please select your region for accurate delivery information";
    }

    // Street address validation if provided
    if (formData.street?.trim() === "") {
      errors.street = "Please provide your street address for delivery";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!validateForm()) {
      toast.error("Please correct the errors in the form before proceeding");
      return;
    }

    // Validate user is logged in
    if (!session?.data?.user?.email) {
      toast.error("Please sign in to your account to proceed with checkout");
      return;
    }

    // Check if cart has items
    if (!cartData?.items || cartData.items.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      return;
    }

    // Calculate total amount
    const cartTotal =
      cartData?.items.reduce((total, item) => total + item.total_price, 0) || 0;

    // Enhanced payload with shipping details to ensure proper order fulfillment
    const payload = {
      amount: cartTotal,
      email: session.data.user.email,
      shippingInfo: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        region: formData.region,
        street: formData.street || "",
        ghana_post: formData.ghana_post || "",
        city: formData.city || "",
        notes: (formData as any).orderNotes || "",
      },
      cartItems: cartData.items.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.total_price,
        color: item.color,
      })),
    };

    // Process checkout with loading toast feedback
    toast.loading("Processing your payment...");
    mutate(payload, {
      onSuccess: () => {
        toast.dismiss();
        toast.success("Payment initiated successfully!");
      },
      onError: (error) => {
        toast.dismiss();
        toast.error(`Error: ${error.message || "Failed to process payment"}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Calculate order summary values
  const subtotal =
    cartData?.items.reduce((total, item) => total + item.total_price, 0) || 0;
  const shipping = 0; // Free shipping for now
  const total = subtotal + shipping;

  return (
    <main className="max-w-[100rem] mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">Checkout</h1>
        <SimpleShopBreadcrumb />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Billing details form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-1 border border-black/50 h-fit"
        >
          <div className="bg-transparent p-6 rounded-none border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Billing Details</h2>

            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <CheckoutFormInput
                label="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                error={formErrors.name}
              />
              <CheckoutFormInput
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                error={formErrors.phone}
              />
            </div>

            <CheckoutFormInput
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              error={formErrors.email}
            />

            {/* Region field */}
            <CheckoutFormInput
              label="Region"
              name="region"
              as="select"
              value={formData.region}
              onChange={handleInputChange}
              options={GHANA_REGIONS}
              required
              error={formErrors.region}
            />

            {/* Street address field */}
            <CheckoutFormInput
              label="Street address"
              name="street"
              value={formData.street || ""}
              onChange={handleInputChange}
              placeholder="House number and street name"
            />

            <CheckoutFormInput
              label="Ghana Post GPS"
              name="ghana_post"
              value={formData.ghana_post || ""}
              onChange={handleInputChange}
              placeholder="Enter your Ghana Post GPS address  "
            />
            <CheckoutFormInput
              label="Order notes"
              name="orderNotes"
              value={(formData as any).orderNotes || ""}
              onChange={handleInputChange}
              placeholder="Notes about your order, e.g. special notes for delivery."
              as="textarea"
              rows={3}
            />
          </div>
        </form>

        {/* Order summary */}
        <div>
          <div className="bg-transparent p-6 rounded-none border border-black/50">
            <h2 className="text-xl font-semibold mb-6">Your Order</h2>

            <div className="flex justify-between text-sm font-medium border-b border-gray-200 pb-2 mb-2">
              <span>Product</span>
              <span>Subtotal</span>
            </div>

            {/* Cart items */}
            <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
              {cartData?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-black/30"
                >
                  <div className="flex items-center">
                    {item.image && (
                      <div className="relative w-12 h-12 mr-3 rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <div className="flex items-center gap-2 px-1">
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></span>{" "}
                        × {item.quantity}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(item.total_price)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order summary calculations */}
            <div className="space-y-2 py-4 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Shipping</span>
                <span className="text-sm">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between py-4 mb-6">
              <span className="text-base font-semibold">Total</span>
              <span className="text-base font-bold">{formatPrice(total)}</span>
            </div>

            {/* Payment information */}
            <div className="mb-6">
              <h3 className="text-base font-medium mb-4">
                Payment information
              </h3>
              <div className="bg-transparent p-4 rounded-none border border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Make payment using your debit and credit cards
                </p>
                <div className="mb-4 border rounded-full border-black/20 inline-block p-2">
                  {/* Payment method icons */}
                  <ResponsiveLazyImage
                    src="/images/idIi-h8rZ0_1747817155339.png"
                    width={20}
                    alt="paystack logo"
                    className="object-contain"
                    height={40}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our privacy policy.
                </p>
              </div>
            </div>

            {/* Place order button */}
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-none"
            >
              {isPending ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
