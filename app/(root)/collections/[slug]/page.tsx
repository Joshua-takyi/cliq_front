"use client";

import { useParams } from "next/navigation";
import Grid from "@/components/grid";
import CollectionHeader from "@/components/CollectionHead";
export default function CollectionPage() {
  // Get the slug from the URL parameters
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="max-w-[100rem] mx-auto px-4 py-8">
      {/* Product grid with filtering */}
      <CollectionHeader params={{ slug }} />
      <div className="">
        <Grid />
      </div>
    </div>
  );
}
