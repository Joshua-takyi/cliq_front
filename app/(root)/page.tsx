import Categories from "@/components/categories";
import Hero from "@/components/hero";
import LatestProducts from "@/components/LatestProducts";
import { Suspense } from "react";
import Loader from "../loading";

export default function RootPage() {
  return (
    <div className="font-clen">
      <Hero />
      <Categories />
      <Suspense fallback={<Loader />}>
        <LatestProducts />
      </Suspense>
    </div>
  );
}
