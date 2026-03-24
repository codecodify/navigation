import { prisma } from "@/lib/db";
import { NavigationContent } from "@/components/NavigationContent";
import { HomeAuth } from "@/components/HomeAuth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: { links: true },
    orderBy: { order: "asc" },
  });

  return (
    <HomeAuth>
      <NavigationContent categories={categories} />
    </HomeAuth>
  );
}
