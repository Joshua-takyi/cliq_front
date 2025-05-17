"use client";
import Link from "next/link";
import ResponsiveLazyImage from "./lazyImage";
import Image from "next/image";

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
      <div className="flex h-full items-center">
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
        <div className=" w-full ">
          <p className="w-full py-3 px-2 whitespace-nowrap overflow-hidden text-ellipsis text-sm  font-medium">
            {category.title}
          </p>
        </div>
      </div>
    </Link>
  );
};
