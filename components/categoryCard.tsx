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
    <Link href={category.href} className={` ${className}`}>
      <div className="flex ">
        <ResponsiveLazyImage
          src={category.image}
          alt={category.title}
          height={100}
          width={100}
          className="p-2"
          key={category.id}
          srcset={category.image}
          sizes="(max-width: 200px) 100vw, 200px"
        />
        <div className="flex flex-col justify-center items-center w-full">
          <p className="w-full px-2">{category.title}</p>
        </div>
      </div>
    </Link>
  );
};
