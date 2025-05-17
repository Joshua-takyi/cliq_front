"use client";
import { CategoryCard } from "./categoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, CSSProperties } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react"; // Added for React.CSSProperties
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import chevron icons for better visibility

const customStyles = `
  /* Connected border styling for carousel items */
  .slick-slide {
    padding: 0; /* Remove padding for connected borders */
  }
  
  /* Grid-like connected carousel styling */
  .connected-carousel .slick-track {
    display: flex;
    margin: 0 auto;
  }
  
  .connected-carousel .slick-slide {
    float: none;
    height: auto;
    margin: 0; /* Remove margin for connected borders */
  }
  
  /* Custom styling for the carousel container */
  .carousel-wrapper {
    overflow: hidden;
    position: relative;
  }
  
  /* Card styling without borders or shadows */
  .category-card-container {
    height: 100%;
    transition: all 0.2s ease;
    position: relative;
    margin: 0;
    border-radius: 0;
  }
  
  /* Remove right border from last item in each row */
  .connected-carousel .slick-slide:nth-child(5n) .category-card-container {
    border-right: none;
  }
  
  @media (max-width: 1600px) {
    .connected-carousel .slick-slide:nth-child(5n) .category-card-container {
      border-right: none;
    }
  }
  
  @media (max-width: 1280px) {
    .connected-carousel .slick-slide:nth-child(4n) .category-card-container {
      border-right: none;
    }
  }
  
  @media (max-width: 1024px) {
    .connected-carousel .slick-slide:nth-child(3n) .category-card-container {
      border-right: none;
    }
  }
  
  /* Make dots more compact and stylish */
  .slick-dots {
    margin-top: 12px;
    bottom: -35px;
  }
  
  .slick-dots li {
    margin: 0 2px;
  }
  
  .slick-dots li button:before {
    font-size: 8px;
    color: #9ca3af; /* Gray dot */
    opacity: 0.5;
  }
  
  .slick-dots li.slick-active button:before {
    color: #4b5563; /* Darker dot for active state */
    opacity: 1;
  }
  
  /* Category card hover effect without shadow */
  .category-card-container:hover {
    z-index: 2; /* Bring hovered item to front */
  }
  
  
  /* Custom styling for images in the carousel */
  .category-card img {
    max-height: 90px;
    transition: transform 0.3s ease;
    object-fit: contain;
  }
  
  /* Create uniformity in card heights for the grid layout */
  .category-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  /* Hide default slick arrows completely */
  .slick-prev:before, 
  .slick-next:before {
    display: none !important;
  }
  
  /* Custom arrow styling */
  .custom-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    border: 1.5px solid #e5e7eb;
    opacity: 0.95;
    transition: all 0.3s ease;
  }
  
  .custom-arrow:hover {
    opacity: 1;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    background-color: #f9fafb;
    border-color: #d1d5db;
  }
  
  .custom-arrow-prev {
    left: -10px;
  }
  
  .custom-arrow-next {
    right: -10px;
  }
`;

const carouselStyles: { [key: string]: CSSProperties } = {
  cardContainer: {
    height: "100%", // Full height for borders to connect properly
    display: "flex",
    flexDirection: "column",
  },
  carouselContainer: {
    position: "relative",
    padding: "0", // No padding for true grid look
    marginBottom: "40px", // Space for dots below
  },
  categoryTitle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "0.9rem",
    fontWeight: 500, // Medium weight for better readability
    padding: "12px 0",
  },
  categoryImage: {
    height: "110px",
    width: "110px",
    objectFit: "contain",
    padding: "0",
  },
};

const categories = [
  {
    id: "1",
    title: "Phone Cases",
    image: "/images/HRTP2.png",
    href: `/collections/phone-cases?category=phone-cases`,
  },
  {
    id: "2",
    title: "Airpod Cases",
    image: "/images/MWK43.png",
    href: "/collections/airpod-cases?category=airpod-case",
  },
  {
    id: "3",
    title: "Wireless Earbuds",
    image: "/images/airpods-pro-2-hero-select-202409.png",
    href: "/collections/watch-protection?category=watch-protection",
  },
  {
    id: "4",
    title: "Chargers",
    image: "/images/MU7T2_GEO_US.png",
    href: "/collections/chargers?category=chargers",
  },
  {
    id: "5",
    title: "Watch Straps",
    image: "/images/MDFU4.png",
    href: "/collections/watch-straps?category=watch-straps",
  },
  {
    id: "6",
    title: "Headphones and Speakers",
    image: "/images/airpods-max-select-202409-midnight.png",
    href: "/collections/headphones?category=headphones",
  },
  {
    id: "8",
    title: "Cables",
    image: "/images/MC9C4.png",
    href: "/collections/cables?category=cables",
  },
  {
    id: "9",
    title: "Adapters",
    image: "/images/MU7T2_GEO_US.png",
    href: "/collections/adapters?category=adapters",
  },
  {
    id: "10",
    title: "Ipad Accessories",
    image: "/images/MWK43.png",
    href: "/collections/ipad-accessories?category=ipad-accessories",
  },
  {
    id: "12",
    title: "Gaming Accessories",
    image: "/images/MXK83.png",
    href: "/collections/gaming-accessories?category=gaming-accessories",
  },
];

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const PrevArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div className="custom-arrow custom-arrow-prev" onClick={onClick}>
      <ChevronLeft className="h-6 w-6 text-gray-900" strokeWidth={2.5} />
    </div>
  );
};

const NextArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div className="custom-arrow custom-arrow-next" onClick={onClick}>
      <ChevronRight className="h-6 w-6 text-gray-900" strokeWidth={2.5} />
    </div>
  );
};

const Categories = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Check if window is defined (for Next.js)
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize(); // Initial call
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 5, // 5 items per row to match the image reference
    slidesToScroll: 5, // Scroll full rows at a time for grid-like behavior
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)", // Material design easing for smoother transitions
    arrows: true, // Show arrows
    initialSlide: 0,
    swipeToSlide: false, // Disable individual item swiping to enforce row-based navigation
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    afterChange: (current: number) => setActiveSlide(current),
    centerMode: false, // Ensure cards are aligned to the left
    centerPadding: "0px", // No extra padding
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3, // Scroll full rows
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // 2 items per row on tablets
          slidesToScroll: 2, // Scroll full rows
          arrows: false, // Hide arrows on smaller screens
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "30px", // Add some padding on small screens for a peek effect
        },
      },
    ],
  };

  return (
    <div>
      <style jsx global>
        {customStyles}
      </style>
      <div className="px-2">
        <div className="carousel-wrapper">
          <div
            className="relative carousel-container connected-carousel"
            style={carouselStyles.carouselContainer}
          >
            <Slider ref={sliderRef} {...settings}>
              {categories.map((cat) => (
                <div key={cat.id} className="h-full">
                  <div
                    className="category-card-container overflow-hidden"
                    style={carouselStyles.cardContainer}
                  >
                    <CategoryCard category={cat} className="relative h-full" />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          {/* Mobile indicator */}
          <div className="flex justify-center mt-4 lg:hidden">
            <div className="text-sm text-gray-500">
              Swipe to see more categories
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
