"use client";

import { use, useEffect, useState } from "react";
import { conditionalHeader } from "@/-database/db";

interface SlugPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

const CollectionHeader = ({ params }: SlugPageProps) => {
  const [header, setHeader] = useState<
    { header: string; description: string } | undefined
  >();

  // Properly handle Promise-based params using React.use() for Next.js compatibility
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    const getSlug = async () => {
      // Check if params is a Promise by examining its structure
      if (params && typeof params === "object" && "then" in params) {
        // It's a Promise, unwrap it using React.use() for proper Next.js compatibility
        const resolvedParams = use(params);
        setSlug(resolvedParams.slug);
      } else if (params && "slug" in params) {
        // It's a direct object - for backward compatibility with legacy Next.js versions
        setSlug((params as { slug: string }).slug);
      }
    };

    getSlug();
  }, [params]);

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
