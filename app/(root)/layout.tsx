import Footer from "@/components/footer";
import { TopHeader } from "@/components/header";
import { Nav } from "@/components/nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopHeader />
      <Nav />

      {/* main flex‑grows to fill leftover space */}
      <main className="flex-grow pb-10 lg:pb-0">{children}</main>

      <Footer />
    </div>
  );
}
