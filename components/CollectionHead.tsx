"use client";

import { useEffect, useState } from "react";
import { conditionalHeader } from "@/-database/db";

interface SlugPageProps {
  params: { slug: string };
}

const CollectionHeader = ({ params }: SlugPageProps) => {
  const [header, setHeader] = useState<
    { header: string; description: string } | undefined
  >();
  const slug = params.slug;

  useEffect(() => {
    const matchingHeader = conditionalHeader.find(
      (item) => item.header === slug
    );
    setHeader(matchingHeader);
  }, [slug]);

  return (
    <main className="">
      <div className="flex justify-center">
        <div className="lg:p-4 py-10 px-2 lg:w-[470px] lg:h-[210px] flex flex-col justify-center gap-2">
          <h1 className="text-xl uppercase text-pretty w-full text-center">
            {header?.header}
          </h1>
          <div className="h-full flex flex-col justify-center">
            <p className="header font-medium text-sm lg:leading-6 text-pretty text-center">
              {header?.description}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-black/40"></div>
    </main>
  );
};

export default CollectionHeader;
