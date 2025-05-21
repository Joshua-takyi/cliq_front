"use client";

import { SimpleShopBreadcrumb } from "@/components/ShopBreadcrumb";
import { Button } from "@/components/ui/button";
import { UseCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { GetCart, RemoveFromCart, UpdateCart } = UseCart();
  // const [couponCode, setCouponCode] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const session = useSession();
  const discount = 0;
  const { data } = GetCart;

  // TODO: Implement the logic to apply the coupon code
  // type CouponEvent = React.MouseEvent<HTMLButtonElement>;
  // const handleApplyCoupon = (e: CouponEvent) => {
  //   e.preventDefault();
  //   console.log("Applying coupon:", couponCode);
  // };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatTitle = (title: string, maxLength: number = 25) => {
    if (isMobile) {
      return title.length > maxLength
        ? `${title.slice(0, maxLength)}...`
        : title;
    }
    return title;
  };

  const cartTotal =
    data?.items.reduce((total, item) => total + item.total_price, 0) || 0;
  if (data?.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Your cart is currently empty.</p>
      </div>
    );
  }

  const handleCheckout = () => {
    // Validate cart has items
    if (!data?.items || data.items.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      return;
    }

    // Validate user is logged in
    if (!session?.data?.user?.email) {
      toast.error("Please sign in to proceed with checkout");
      return;
    }

    // Navigate to checkout page instead of directly initiating payment
    window.location.href = "/checkout";
  };

  return (
    <main className="max-w-[100rem] mx-auto px-4 py-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">
          Shopping cart
        </h1>
        <div className="flex items-center text-xs md:text-sm text-gray-500">
          <SimpleShopBreadcrumb />
        </div>
      </div>

      {data?.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl mb-4">Your cart is currently empty.</p>
          <div className="mb-6 text-gray-500">
            Before proceed to checkout you must add some products to your
            shopping cart. You will find a lot of interesting products on our
            "Shop" page.
          </div>
          <Link href="/collections">
            <Button className="bg-black rounded-none  hover:bg-gray-800 text-white px-8 py-3">
              Return to shop
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border-b pb-4 mb-4 grid grid-cols-4 font-semibold">
              <div className="col-span-2">Product</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Subtotal</div>
            </div>

            {data?.items.map((item, index) => (
              <div
                key={`${item.title}-${item.color || "default"}-${index}`}
                className="border-b pb-6 mb-6"
              >
                <div className="grid grid-cols-4 items-center  py-2">
                  <div className="col-span-2 flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => RemoveFromCart.mutate({ id: item.id })}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Remove item"
                    >
                      ×
                    </button>

                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0`}
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div>
                      <h3
                        className={`font-medium ${
                          isMobile ? "text-sm line-clamp-2" : ""
                        }`}
                      >
                        {formatTitle(item.title)}
                      </h3>
                      {item.color && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <span>Color:</span>
                          <span
                            style={{ backgroundColor: item.color }}
                            className={`size-3.5  rounded-full border  ml-1`}
                          ></span>
                        </div>
                      )}
                      {/* <p className="text-sm">{formatPrice(item.price)}</p> */}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="inline-flex border">
                      <button
                        onClick={() =>
                          UpdateCart.mutate({
                            action: "decrement",
                            cart_item_id: item.id,
                          })
                        }
                        className="px-3 py-1 border-r hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button
                        onClick={() =>
                          UpdateCart.mutate({
                            action: "increment",
                            cart_item_id: item.id,
                          })
                        }
                        className="px-3 py-1 border-l hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-medium">
                    {formatPrice(item.total_price)}
                  </div>
                </div>
              </div>
            ))}

            {/* <div className="flex justify-between items-center pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="border p-2 text-sm"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  className="bg-black rounded-none cursor-pointer text-white hover:bg-gray-800"
                  variant="default"
                  onClick={handleApplyCoupon}
                >
                  Apply Coupon
                </Button>
              </div>
            </div> */}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 border ">
            <div className="border p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Totals</h2>

              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  {/* Display the subtotal with proper currency formatting */}
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Enter your address to view shipping options.
                    </p>
                    <button className="text-sm underline">
                      Calculate shipping
                    </button>
                  </div>
                </div>
              </div>

              {discount > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal - discount)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-black rounded-none h-12 cursor-pointer text-white hover:bg-gray-800 p-3"
              >
                Proceed To Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
