import Link from "next/link";

export default function PaymentCompletePage() {
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">
          Payment Complete
        </h1>
        <div className="flex items-center text-xs md:text-sm text-gray-500">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">→</span>
          <span>Payment Complete</span>
        </div>
      </div>

      <div className="text-center py-12">
        <p className="text-xl mb-4">Thank you for your payment!</p>
        <p>Your order has been successfully processed.</p>
      </div>
    </main>
  );
}
