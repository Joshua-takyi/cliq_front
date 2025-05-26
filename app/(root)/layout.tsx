import Footer from "@/components/footer";
import { Nav } from "@/components/nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-grow pb-10 lg:pb-0">{children}</main>

      <Footer />
    </div>
  );
}
