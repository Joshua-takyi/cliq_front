import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center flex-col justify-center min-h-screen">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <div className="mt-4 justify-center items-center">
        <Link href={"/"} className="text-blue-600 hover:text-blue-900">
          <Button>Go Backl</Button>
        </Link>
      </div>
    </div>
  );
}
