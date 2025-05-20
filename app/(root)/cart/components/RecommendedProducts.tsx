"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface RecommendedProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

/**
 * Recommended product card component for the cart page
 * Displays small product cards in the "You May Be Interested In" section
 */
export default function RecommendedProduct({
  id,
  name,
  price,
  image,
  slug,
}: RecommendedProductProps) {
  return (
    <Link href={`/product/${slug}`} className="group">
      <div className="relative aspect-square overflow-hidden bg-gray-100 mb-2">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-sm font-medium truncate">{name}</h3>
      <p className="text-sm text-gray-700">{formatPrice(price)}</p>
    </Link>
  );
}

/**
 * Component to display recommended products on the cart page
 */
export function RecommendedProducts() {
  // Mock data - in a real app, you would fetch this from an API
  const [products, setProducts] = useState<RecommendedProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading recommended products
    setTimeout(() => {
      setProducts([
        {
          id: "rec-1",
          name: "iPhone 15 Pro Case - Black",
          price: 29.99,
          image:
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80",
          slug: "iphone-15-pro-case-black",
        },
        {
          id: "rec-2",
          name: "Samsung Galaxy S24 Case - Red",
          price: 24.99,
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          slug: "samsung-galaxy-s24-case-red",
        },
        {
          id: "rec-3",
          name: "Google Pixel 8 Case - Clear",
          price: 19.99,
          image:
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80",
          slug: "google-pixel-8-case-clear",
        },
        {
          id: "rec-4",
          name: "iPhone 15 Screen Protector",
          price: 14.99,
          image:
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
          slug: "iphone-15-screen-protector",
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 mb-2" />
            <div className="h-4 bg-gray-200 mb-2" />
            <div className="h-4 bg-gray-200 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <RecommendedProduct key={product.id} {...product} />
      ))}
    </div>
  );
}
