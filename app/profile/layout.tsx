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

      {/* Main container */}
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row ">
          {/* Left sidebar - fixed width and height with scroll overflow */}
          <div className="w-full lg:w-80 lg:flex-shrink-0 lg:h-full lg:overflow-y-auto ">
            <SideBar />
          </div>

          {/* Main content area - similar to the image with a border */}
          <main className="flex-1 border-l border-gray-200 lg:pl-8 mt-8 lg:mt-0 lg:overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
