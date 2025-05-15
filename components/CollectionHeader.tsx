// Define the props type for the server component, expecting a slug param from the route
interface SlugPageProps {
  params: { slug: string };
}

const CollectionHeader = async ({ params }: SlugPageProps) => {
  const conditionalHeader = [
    {
      id: 1,
      header: "phone-cases",
      description:
        "A variety of phone cases designed to protect your device while showcasing your style.\nExplore our collection to find the perfect case that fits your personality and needs.",
    },
    {
      id: 2,
      header: "airpod-cases",
      description:
        "Stylish and functional AirPod cases that provide protection and personalization.\nDiscover our range of designs to keep your AirPods safe and looking great.",
    },
    {
      id: 3,
      header: "watch-protection",
      description:
        "Durable watch protection solutions designed to keep your timepiece safe from scratches and damage.\nExplore our collection for stylish options that fit your lifestyle.",
    },
    {
      id: 4,
      header: "chargers",
      description:
        "High-quality chargers designed for fast and efficient charging of your devices.\nExplore our range to find the perfect charger that meets your needs.",
    },
    {
      id: 5,
      header: "watch-straps",
      description:
        "A collection of stylish and durable watch straps to personalize your timepiece.\nExplore our range to find the perfect strap that matches your style and comfort.",
    },
    {
      id: 6,
      header: "headphones",
      description:
        "High-quality headphones designed for an immersive audio experience.\nExplore our collection to find the perfect pair that suits your style and sound preferences.",
    },
  ];

  const slug = await params.slug;
  // Find the header object that matches the slug from the route params
  const header = conditionalHeader.find((item) => item.header === slug);

  return (
    <main className="">
      <div className="flex justify-center">
        <div className="p-4 lg:w-[470px] lg:h-[406px] flex flex-col justify-center gap-2">
          <h1 className="text-xl uppercase text-pretty w-full text-center">
            {header?.header}
          </h1>
          <div className="h-full flex flex-col justify-center">
            <p className="header font-medium lg:leading-6 text-pretty text-center">
              {header?.description}
            </p>
          </div>
        </div>
      </div>
      {/* section for additional content */}
      <div className="border-t border-black/40"></div>
    </main>
  );
};

export default CollectionHeader;
