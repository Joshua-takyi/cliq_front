import CollectionHeader from "@/components/CollectionHeader";

interface CollectionPageProps {
  params: { slug: string };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  return (
    <main>
      {/* Pass the slug to the CollectionHeader component as required */}
      <CollectionHeader params={{ slug }} />
    </main>
  );
}
