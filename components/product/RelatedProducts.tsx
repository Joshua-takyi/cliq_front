"use client";

import { useState, useEffect } from "react";
import { ProductProps } from "@/types/product_types";
import ProductCard from "../productCard";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface RelatedProductsProps {
  category: string[];
  tags: string[];
  currentProductId: string;
}

/**
 * RelatedProducts component displays a carousel of products related to the current one
 * based on category and tags
 *
 * @param category - The product categories to match
 * @param tags - The product tags to match
 * @param currentProductId - ID of current product (to exclude from results)
 */
const RelatedProducts: React.FC<RelatedProductsProps> = ({
  category,
  tags,
  currentProductId,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4; // Number of products to show at once

  // Mock function to fetch related products
  // In a real app, this would be an API call
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock related products data
        const mockProducts: ProductProps[] = [
          {
            id: "rel1",
            title: "Premium Wireless Earbuds",
            description: "High quality sound with noise cancellation.",
            price: 129.99,
            images: [
              "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZWFyYnVkc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            ],
            tags: ["audio", "wireless", "premium"],
            materials: ["plastic", "silicone"],
            colors: ["black", "white", "blue"],
            category: ["Electronics", "Audio"],
            stock: 25,
            isFeatured: true,
            rating: 4.8,
            slug: "premium-wireless-earbuds",
          },
          {
            id: "rel2",
            title: "Smart Watch Band",
            description: "Comfortable and stylish band for your smartwatch.",
            price: 29.99,
            images: [
              "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2glMjBiYW5kfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            ],
            tags: ["wearable", "accessories"],
            materials: ["silicone", "aluminum"],
            colors: ["black", "red", "navy"],
            category: ["Accessories", "Wearables"],
            stock: 42,
            isNew: true,
            rating: 4.6,
            slug: "smart-watch-band",
          },
          {
            id: "rel3",
            title: "Fast Charging Cable",
            description: "Durable cable with fast charging capability.",
            price: 14.99,
            images: [
              "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhcmdpbmclMjBjYWJsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            ],
            tags: ["charging", "accessories"],
            materials: ["nylon", "metal"],
            colors: ["black", "white", "red"],
            category: ["Electronics", "Accessories"],
            stock: 100,
            isBestSeller: true,
            rating: 4.5,
            slug: "fast-charging-cable",
          },
          {
            id: "rel4",
            title: "Bluetooth Speaker",
            description: "Portable speaker with amazing sound quality.",
            price: 79.99,
            images: [
              "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            ],
            tags: ["audio", "bluetooth", "portable"],
            materials: ["plastic", "fabric"],
            colors: ["black", "blue", "red"],
            category: ["Electronics", "Audio"],
            stock: 18,
            isNew: true,
            rating: 4.4,
            slug: "bluetooth-speaker",
          },
          {
            id: "rel5",
            title: "Phone Case",
            description: "Protective and stylish case for your smartphone.",
            price: 19.99,
            images: [
              "https://images.unsplash.com/photo-1541877944-ac82a091518a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvbmUlMjBjYXNlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            ],
            tags: ["accessories", "protection"],
            materials: ["silicone", "polycarbonate"],
            colors: ["clear", "black", "pink"],
            category: ["Accessories", "Phone Accessories"],
            stock: 45,
            isBestSeller: true,
            rating: 4.7,
            slug: "phone-case",
          },
          {
            id: "rel6",
            title: "Wireless Charger",
            description: "Fast wireless charging pad for compatible devices.",
            price: 34.99,
            images: [
              "https://images.unsplash.com/photo-1585142254663-64af4a5d2d90?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2lyZWxlc3MlMjBjaGFyZ2VyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            ],
            tags: ["charging", "wireless"],
            materials: ["plastic", "metal"],
            colors: ["black", "white"],
            category: ["Electronics", "Accessories"],
            stock: 30,
            isFeatured: true,
            rating: 4.3,
            slug: "wireless-charger",
          },
        ];

        // Filter out the current product
        const filteredProducts = mockProducts.filter(
          (product) => product.id !== currentProductId
        );

        // Sort by relevance (matching categories and tags)
        const sortedProducts = filteredProducts.sort((a, b) => {
          const aCategoryMatch = a.category.some((cat) =>
            category.includes(cat)
          )
            ? 1
            : 0;
          const bCategoryMatch = b.category.some((cat) =>
            category.includes(cat)
          )
            ? 1
            : 0;

          const aTagMatch = a.tags.filter((tag) => tags.includes(tag)).length;
          const bTagMatch = b.tags.filter((tag) => tags.includes(tag)).length;

          const aRelevance = aCategoryMatch * 2 + aTagMatch;
          const bRelevance = bCategoryMatch * 2 + bTagMatch;

          return bRelevance - aRelevance;
        });

        setRelatedProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category, tags, currentProductId]);

  // Calculate pagination
  const totalPages = Math.ceil(relatedProducts.length / productsPerPage);
  const currentProducts = relatedProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  // Handle navigation
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 mb-4 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No related products
  if (relatedProducts.length === 0) {
    return null; // Don't show section if no related products
  }

  return (
    <div className="my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">You May Also Like</h2>

        {/* Navigation arrows (only show if more than one page) */}
        {totalPages > 1 && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard
              product={{
                ...product,
                slug: product.slug || product.id,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Pagination dots */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === currentPage ? "bg-black" : "bg-gray-300"
              }`}
              onClick={() => setCurrentPage(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
