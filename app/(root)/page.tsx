import Categories from "@/components/categories";
import Hero from "@/components/hero";
import LatestProducts from "@/components/LatestProducts";

export default function RootPage() {
  return (
    <div className="font-clen">
      <Hero />
      <Categories />
      <LatestProducts />
    </div>
  );
}
