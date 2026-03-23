import { prisma } from "@/lib/db";
import { CategorySection } from "@/components/CategorySection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: { links: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            <span className="font-semibold">导航</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="container py-8">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              还没有添加任何链接
            </p>
            <p className="text-sm text-muted-foreground">
              访问 /admin 添加分类和链接
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                name={category.name}
                links={category.links.sort((a, b) => a.order - b.order)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
