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
        {/* Image container - centered on top */}
        <div className="flex justify-center items-center p-4 flex-grow">
          <ResponsiveLazyImage
            src={category.image}
            alt={category.title}
            height={90}
            width={100}
            className="object-contain"
            key={category.id}
            srcset={category.image}
            sizes="(max-width: 200px) 100vw, 200px"
          />
        </div>
        {/* Title container - allow text to wrap */}
        <div className="w-full">
          <p className="w-full py-3 px-2 text-sm font-medium text-center hyphens-auto break-words min-h-[3.5rem] flex items-center justify-center">
            {category.title}
          </p>
        </div>
      </div>
    </Link>
  );
};
