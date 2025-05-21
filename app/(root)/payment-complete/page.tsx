"use client";

import { useVerifyPayment } from "@/app/services/verifyPayment";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentCompletePage() {
  // Get payment verification data using our custom hook
  const { verifyPaymentQuery, reference, deliveryDetails } = useVerifyPayment();
  const { data, isLoading, isError, error } = verifyPaymentQuery;
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<Record<string, string>>({});

  // Extract URL parameters for debugging
  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setDebugInfo(params);
  }, [searchParams]);

  // Clear cart reference from localStorage on component unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem("paymentReference");
      localStorage.removeItem("deliveryDetails");
      localStorage.removeItem("paymentTimestamp");
      localStorage.removeItem("deliveryDetailsTimestamp");
    };
  }, []);

  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">
          Payment Status
        </h1>
        <div className="flex items-center text-xs md:text-sm text-gray-500">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">→</span>
          <Link href="/cart" className="hover:underline">
            Cart
          </Link>
          <span className="mx-2">→</span>
          <span>Payment Status</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto border p-6 rounded-lg shadow-sm">
        {isLoading ? (
          // Loading state
          <div className="text-center py-12">
            <p className="text-xl mb-4">Verifying payment...</p>
            <p>Please wait while we confirm your payment details.</p>
            <p className="mt-4 text-xs text-gray-500">
              Reference: {reference || "Not found"}
            </p>
          </div>
        ) : isError ? (
          // Error state
          <div className="text-center py-12">
            <p className="text-xl mb-4 text-red-600">
              Payment Verification Failed
            </p>
            <p className="mb-4">
              {error?.message || "There was an issue verifying your payment."}
            </p>
            <div className="bg-gray-50 p-4 rounded mb-6 text-left">
              <h3 className="font-semibold mb-2">What happened?</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  Your payment might be processing but verification failed
                </li>
                <li>
                  Network issues may have interrupted the verification process
                </li>
                <li>Session token might have expired</li>
              </ul>
              <h3 className="font-semibold mt-4 mb-2">What to do next:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Check your email for payment confirmation</li>
                <li>Wait a few minutes and refresh this page</li>
                <li>
                  Contact customer support if payment was deducted from your
                  account
                </li>
              </ul>

              {/* Debug information - only visible in development */}
              {process.env.NODE_ENV === "development" &&
                Object.keys(debugInfo).length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-sm">
                      Debug Information (URL Parameters):
                    </h4>
                    <pre className="text-xs bg-gray-100 p-2 mt-2 overflow-auto">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </div>
                )}
            </div>

            <div className="text-center mt-6">
              <Button asChild className="bg-black hover:bg-gray-800">
                <Link href="/cart">Return to Cart</Link>
              </Button>
            </div>
          </div>
        ) : data?.status === "success" ? (
          // Success state
          <div className="py-6">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-600 text-center">
                Your order has been received and is now being processed.
              </p>
            </div>

            {/* Order Details */}
            <div className="border-t border-b py-4 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order Reference</p>
                  <p className="font-medium">
                    {data.reference || reference || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {data.date
                      ? new Date(data.date).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">
                    {data.amount ? formatPrice(data.amount) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">Card Payment</p>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            {deliveryDetails && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Delivery Details</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">
                        {`${deliveryDetails.firstName} ${
                          deliveryDetails.lastName || ""
                        }`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {deliveryDetails.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{deliveryDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Region</p>
                      <p className="font-medium">{deliveryDetails.region}</p>
                    </div>
                    {deliveryDetails.streetAddress && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                          {deliveryDetails.streetAddress}
                        </p>
                      </div>
                    )}
                    {deliveryDetails.shipToAnotherAddress &&
                      deliveryDetails.shippingAddress && (
                        <div className="col-span-2 mt-2 border-t pt-3">
                          <p className="text-sm font-medium mb-2">
                            Shipping Address
                          </p>
                          <p className="text-sm">
                            {`${deliveryDetails.shippingAddress.firstName} ${
                              deliveryDetails.shippingAddress.lastName || ""
                            }`}
                            <br />
                            {deliveryDetails.shippingAddress.phoneNumber}
                            <br />
                            {deliveryDetails.shippingAddress.streetAddress}
                            <br />
                            {`${deliveryDetails.shippingAddress.region}, ${deliveryDetails.shippingAddress.country}`}
                          </p>
                        </div>
                      )}
                    {deliveryDetails.orderNotes && (
                      <div className="col-span-2 mt-2">
                        <p className="text-sm text-gray-500">Order Notes</p>
                        <p className="text-sm">{deliveryDetails.orderNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-6 space-x-4">
              <Button asChild className="bg-black hover:bg-gray-800">
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <Link href="/profile">View My Orders</Link>
              </Button>
            </div>
          </div>
        ) : (
          // Failed payment state
          <div className="text-center py-12">
            <p className="text-xl mb-4 text-red-600">Payment Failed</p>
            <p className="mb-6">
              {data?.message ||
                "Your payment could not be processed. Please try again."}
            </p>
            <div className="space-x-4">
              <Button asChild className="bg-black hover:bg-gray-800">
                <Link href="/cart">Return to Cart</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <Link href="/checkout">Try Again</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
