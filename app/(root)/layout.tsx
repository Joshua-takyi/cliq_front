import { TopHeader } from "@/components/header";
import { Nav } from "@/components/nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TopHeader />
      <Nav />
      <main>{children}</main>
    </div>
  );
}
