"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResponsiveLazyImage from "./lazyImage";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = [],
  alt = "",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Updated fade transition variants
  const fadeVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback(
    (newDirection: number) => {
      // setDirection(newDirection);
      setActiveIndex(
        (prev) => (prev + newDirection + images.length) % images.length
      );
    },
    [images.length]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        paginate(-1);
      } else if (event.key === "ArrowRight") {
        paginate(1);
      }
    },
    [paginate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const thumbnails = useMemo(
    () =>
      images.map((image, index) => (
        <div key={index} className="relative flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // setDirection(index > activeIndex ? 1 : -1);
              setActiveIndex(index);
            }}
            className="relative w-[60px] h-[60px]"
            aria-label={`View image ${index + 1}`}
            aria-current={activeIndex === index ? "true" : "false"}
          >
            <ResponsiveLazyImage
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="object-cover rounded-md"
              data-src={image}
              sizes="60px"
            />
          </motion.button>
          <motion.div
            initial={false}
            animate={{
              opacity: activeIndex === index ? 1 : 0,
              scale: activeIndex === index ? 1 : 0.8,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="absolute -bottom-2 left-0 w-full h-0.5 bg-black"
          />
        </div>
      )),
    [images, activeIndex]
  );

  if (!images.length) {
    return (
      <div className="flex items-center justify-center h-64 w-full rounded-lg border-2 border-gray-200">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full space-y-1">
      <div className="relative w-full h-[330px] md:h-[430px] lg:h-[600px] overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeIndex}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 w-full h-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            <ResponsiveLazyImage
              src={images[activeIndex]}
              alt={`${alt} - Image ${activeIndex + 1}`}
              sizes="100vw"
              className="object-contain w-full h-full"
              data-src={images[activeIndex]}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center w-full max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex gap-3 mx-auto ">{thumbnails}</div>
      </div>
    </div>
  );
};

export default ImageCarousel;
