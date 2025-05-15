"use client";
import { useSearchParams } from "next/navigation";

export default function Collections() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">{category}</h1>
    </div>
  );
}
