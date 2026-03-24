import { prisma } from "@/lib/db";
import { NavigationContent } from "@/components/NavigationContent";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: { links: true },
    orderBy: { order: "asc" },
  });

  return <NavigationContent categories={categories} />;
}
