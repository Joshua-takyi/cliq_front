"use client";
import Link from "next/link";
import ResponsiveLazyImage from "./lazyImage";

interface CategoryCardProps {
  category: {
    id: string;
    title: string;
    image: string;
    href: string;
    className?: string;
  };
  className?: string;
}
export const CategoryCard = ({ category, className }: CategoryCardProps) => {
  return (
    <Link href={category.href} className={` border border-black ${className}`}>
      <div className="flex flex-col h-full">
        {/* Image container - centered on top with reduced padding for shorter cards */}
        <div className="flex justify-center items-center p-2 sm:p-3 flex-grow">
          <ResponsiveLazyImage
            src={category.image}
            alt={category.title}
            height={60} // Reduced height for more compact design (was 90)
            width={80} // Adjusted width to maintain better proportions
            className="object-contain max-h-[40px] sm:max-h-[50px] md:max-h-[60px] w-auto" // Responsive max heights
            key={category.id}
            srcset={category.image}
            sizes="(max-width: 480px) 40px, (max-width: 768px) 50px, 60px" // Responsive sizing
          />
        </div>
        {/* Title container - more compact text area with responsive sizing */}
        <div className="w-full">
          <p className="w-full py-2 sm:py-2.5 px-1 sm:px-2 text-xs sm:text-sm font-medium text-center hyphens-auto break-words min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center leading-tight">
            {category.title}
          </p>
        </div>
      </div>
    </Link>
  );
};
