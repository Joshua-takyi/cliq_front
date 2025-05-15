import { CategoryCard } from "./categoryCard";

const category = [
  {
    id: "1",
    title: "Phone Cases",
    image: "/images/smartphone-case.png",
    href: `/collections/phone-cases?filter=phone-cases`,
  },
  {
    id: "2",
    title: "Airpod Cases",
    image: "/images/airpod.png",
    href: "/collections/airpod-cases?filter=airpod-cases",
  },
  {
    id: "3",
    title: "Watch Protection",
    image: "/images/icon-product-watch.png",
    href: "/collections/watch-protection?filter=watch-protection",
  },
  {
    id: "4",
    title: "Chargers",
    image: "/images/icon-category-charging-essentials.png",
    href: "/collections/chargers?filter=chargers",
  },
  {
    id: "5",
    title: "Watch Straps",
    image: "/images/icon-category-watch-bands.png",
    href: "/collections/watch-straps?filter=watch-straps",
  },
  {
    id: "6",
    title: "Headphones",
    image: "/images/icon-category-audio-music.png",
    href: "/collections/headphones?filter=headphones",
  },
];
const Categories = () => {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-6">
      {category.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          className="border border-black/40"
        />
      ))}
    </div>
  );
};

export default Categories;
