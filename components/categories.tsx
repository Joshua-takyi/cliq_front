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
  
  /* Custom arrow styling - Enhanced for better visibility */
  .custom-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); /* Stronger shadow for better visibility */
    border: 2px solid #9ca3af; /* Darker border for better contrast */
    opacity: 1; /* Full opacity for better visibility */
    transition: all 0.3s ease;
  }
  
  .custom-arrow:hover {
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.35); /* Enhanced shadow on hover */
    background-color: #f3f4f6;
    border-color: #6b7280; /* Darker border on hover for emphasis */
    transform: translateY(-50%) scale(1.05); /* Slight scale effect on hover */
  }
  
  .custom-arrow-prev {
    left: 8px; /* Position slightly further from edge */
  }
  
  .custom-arrow-next {
    right: 8px; /* Position slightly further from edge */
  }
  
  /* Ensure arrows are more visible on mobile with improved positioning */
  @media (max-width: 768px) {
    .custom-arrow {
      width: 40px; /* Larger size on mobile for better tap target */
      height: 40px;
      background-color: rgba(255, 255, 255, 0.98); /* Nearly opaque background */
      border-width: 2px; /* Thicker border for visibility */
    }
    
    .custom-arrow-prev {
      left: 5px;
    }
    
    .custom-arrow-next {
      right: 5px;
    }
  }
  
  /* Extra styles for very small screens */
  @media (max-width: 480px) {
    .custom-arrow {
      width: 38px;
      height: 38px;
      background-color: white;
    }
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
    title: "Headphones/Speakers",
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
    <div
      className="custom-arrow custom-arrow-prev"
      onClick={onClick}
      aria-label="Previous categories"
    >
      <ChevronLeft className="h-5 w-5 text-gray-800" strokeWidth={2.5} />
    </div>
  );
};

const NextArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="custom-arrow custom-arrow-next"
      onClick={onClick}
      aria-label="Next categories"
    >
      <ChevronRight className="h-5 w-5 text-gray-800" strokeWidth={2.5} />
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
    slidesToShow: 5, // 5 items per row on large screens
    slidesToScroll: 5, // Scroll full rows at a time for grid-like behavior
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)", // Material design easing for smoother transitions
    arrows: true, // Show arrows by default
    initialSlide: 0,
    swipeToSlide: true, // Enable swipe for better mobile interaction
    prevArrow: <PrevArrow />, // Custom prev arrow
    nextArrow: <NextArrow />, // Custom next arrow
    afterChange: (current: number) => setActiveSlide(current),
    centerMode: false, // Ensure cards are aligned to the left
    centerPadding: "0px", // No extra padding
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3, // More efficient scrolling
          arrows: true,
        },
      },

      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // 2 items per row on tablets
          slidesToScroll: 2, // Scroll full rows
          arrows: true, // Ensure arrows are visible
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2, // Consistently show 2 items on small screens
          slidesToScroll: 2, // Scroll 2 at a time
          arrows: true, // Ensure arrows are always visible
          centerMode: false,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2, // Maintain 2 items per view on very small screens
          slidesToScroll: 1, // Single item scrolling for better control
          arrows: true, // Keep arrows visible
          centerMode: false,
        },
      },
      {
        // Ultra small screens (e.g. small smartphones)
        breakpoint: 360,
        settings: {
          slidesToShow: 2, // Still maintain 2 items for consistency
          slidesToScroll: 1,
          arrows: true, // Keep arrows visible
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="categories-section">
      <style jsx global>
        {customStyles}
      </style>
      <div className="px-2 sm:px-0">
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
