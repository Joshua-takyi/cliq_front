import Footer from "@/components/footer";
import { Nav } from "@/components/nav";
import SideBar from "@/components/sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <>
      <Nav />
      <div className="max-w-[100rem] mx-auto">
        <div className="flex flex-row gap-5 ">
          <SideBar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
}
