"use client";

import { useCheckout } from "@/app/services/checkout";
import CheckoutFormInput from "@/components/CheckoutFormInput";
import ResponsiveLazyImage from "@/components/lazyImage";
import { SimpleShopBreadcrumb } from "@/components/ShopBreadcrumb";
import { Button } from "@/components/ui/button";
import { UseCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { CheckoutFormData, CheckoutRequest } from "@/types/product_types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

// List of Ghana regions for dropdown selection
const GHANA_REGIONS = [
  { value: "Greater Accra", label: "Greater Accra" },
  { value: "Ashanti", label: "Ashanti" },
  { value: "Central", label: "Central" },
  { value: "Eastern", label: "Eastern" },
  { value: "Western", label: "Western" },
  { value: "Northern", label: "Northern" },
  { value: "Volta", label: "Volta" },
  { value: "Brong Ahafo", label: "Brong Ahafo" },
  { value: "Upper East", label: "Upper East" },
  { value: "Upper West", label: "Upper West" },
];

/**
 * Checkout page component for collecting delivery information and processing payment
 * Displays customer's cart information alongside a delivery details form
 */
export default function CheckoutPage() {
  const { GetCart } = UseCart();
  const { data: cartData, isLoading } = GetCart;
  const session = useSession();
  //   const [couponCode, setCouponCode] = useState("");
  const { mutate, isPending } = useCheckout();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Define form state for checkout
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: session.data?.user?.email || "",
    region: "",
    streetAddress: "",
    country: "Ghana", // Default country
    shipToAnotherAddress: false,
    orderNotes: "",
  });

  // Update email field when session changes
  useEffect(() => {
    if (session.data?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session.data.user.email || "",
      }));
    }
  }, [session.data?.user?.email]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested shipping address fields
    if (name.startsWith("shipping.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress!,
          [field]: value,
        },
      }));

      // Clear any error for this field
      if (formErrors[`shipping.${field}`]) {
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[`shipping.${field}`];
          return updated;
        });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear any error for this field
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.region) {
      errors.region = "Please select a region";
    }

    // Validate shipping address fields if shipping to a different address
    if (formData.shipToAnotherAddress) {
      if (!formData.shippingAddress?.firstName?.trim()) {
        errors["shipping.firstName"] = "First name is required";
      }

      if (!formData.shippingAddress?.phoneNumber?.trim()) {
        errors["shipping.phoneNumber"] = "Phone number is required";
      } else if (
        !/^\+?[0-9]{10,15}$/.test(formData.shippingAddress.phoneNumber.trim())
      ) {
        errors["shipping.phoneNumber"] = "Please enter a valid phone number";
      }

      if (!formData.shippingAddress?.region) {
        errors["shipping.region"] = "Please select a region";
      }

      if (!formData.shippingAddress?.streetAddress?.trim()) {
        errors["shipping.streetAddress"] = "Street address is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    // Validate user is logged in
    if (!session?.data?.user?.email) {
      toast.error("Please sign in to proceed with checkout");
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

    // Prepare checkout request
    const checkoutRequest: CheckoutRequest = {
      amount: cartData?.total_amount || cartTotal,
      email: session.data.user.email,
      deliveryDetails: formData,
    };

    // Process checkout with loading toast feedback
    toast.loading("Processing your payment...");
    mutate(checkoutRequest, {
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

  // Handle applying coupon code
  //   const handleApplyCoupon = (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.preventDefault();

  //     if (!couponCode) {
  //       toast.error("Please enter a coupon code");
  //       return;
  //     }

  //     // Set coupon code in form data
  //     setFormData((prev) => ({
  //       ...prev,
  //       couponCode,
  //     }));

  // TODO: Implement coupon validation with backend
  //     toast.info("Coupon code applied! (Feature in development)");
  //   };

  // Show loading state while cart data is being fetched
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

      {/* Coupon code section */}
      {/* <div className="mb-8 bg-transparent p-4 rounded-none border border-gray-200">
        <div className="flex items-center">
          <span className="mr-2 text-sm">Have a coupon?</span>
          <button
            onClick={() => document.getElementById("coupon-input")?.focus()}
            className="text-sm text-blue-600 hover:underline"
          >
            Click here to enter your code
          </button>
        </div>
        <div className="mt-2 flex">
          <input
            id="coupon-input"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon code"
            className="flex-grow border border-gray-300 rounded-none p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-gray-800 hover:bg-black text-white px-4 rounded-none text-sm"
          >
            Apply
          </button>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Billing details form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-1 border border-black/50"
        >
          <div className="bg-transparent p-6 rounded-none border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Billing Details</h2>

            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <CheckoutFormInput
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                error={formErrors.firstName}
              />
              <CheckoutFormInput
                label="Last name"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleInputChange}
                placeholder="Optional"
              />
            </div>

            {/* Phone field */}
            <CheckoutFormInput
              label="Phone"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              error={formErrors.phoneNumber}
            />

            {/* Email field */}
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
              name="streetAddress"
              value={formData.streetAddress || ""}
              onChange={handleInputChange}
              placeholder="House number and street name"
            />

            {/* Country/Region field */}
            <div className="mb-6">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country / Region <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-none p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled // Disabled since Ghana is currently the only option
              >
                <option value="Ghana">Ghana</option>
              </select>
            </div>

            {/* Shipping address checkbox */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="shipToAnotherAddress"
                  name="shipToAnotherAddress"
                  type="checkbox"
                  checked={formData.shipToAnotherAddress}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="shipToAnotherAddress"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Ship to a different address?
                </label>
              </div>
            </div>

            {/* Shipping address fields (conditionally rendered) */}
            {formData.shipToAnotherAddress && (
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-lg font-medium mb-4">Shipping Address</h3>

                {/* Shipping name fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <CheckoutFormInput
                    label="First name"
                    name="shipping.firstName"
                    value={formData.shippingAddress?.firstName || ""}
                    onChange={handleInputChange}
                    required
                    error={formErrors["shipping.firstName"]}
                  />
                  <CheckoutFormInput
                    label="Last name"
                    name="shipping.lastName"
                    value={formData.shippingAddress?.lastName || ""}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                </div>

                {/* Shipping phone field */}
                <CheckoutFormInput
                  label="Phone"
                  name="shipping.phoneNumber"
                  type="tel"
                  value={formData.shippingAddress?.phoneNumber || ""}
                  onChange={handleInputChange}
                  required
                  error={formErrors["shipping.phoneNumber"]}
                />

                {/* Shipping region field */}
                <CheckoutFormInput
                  label="Region"
                  name="shipping.region"
                  as="select"
                  value={formData.shippingAddress?.region || ""}
                  onChange={handleInputChange}
                  options={GHANA_REGIONS}
                  required
                  error={formErrors["shipping.region"]}
                />

                {/* Shipping street address field */}
                <CheckoutFormInput
                  label="Street address"
                  name="shipping.streetAddress"
                  value={formData.shippingAddress?.streetAddress || ""}
                  onChange={handleInputChange}
                  placeholder="House number and street name"
                  required
                  error={formErrors["shipping.streetAddress"]}
                />

                {/* Shipping country field */}
                <div className="mb-4">
                  <label
                    htmlFor="shipping.country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country / Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="shipping.country"
                    name="shipping.country"
                    required
                    value={formData.shippingAddress?.country || "Ghana"}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-none p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled // Disabled since Ghana is currently the only option
                  >
                    <option value="Ghana">Ghana</option>
                  </select>
                </div>
              </div>
            )}

            {/* Order notes field */}
            <CheckoutFormInput
              label="Order notes"
              name="orderNotes"
              value={formData.orderNotes || ""}
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
