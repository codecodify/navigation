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
    <div className="min-h-screen relative">
      <header className="sticky top-0 z-50 w-full">
        <div className="container">
          <div className="glass rounded-2xl mt-4 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">导航</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-8 relative z-10">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center mb-6">
              <Link2 className="h-10 w-10 text-[#8B5CF6]" />
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              还没有添加任何链接
            </p>
            <p className="text-sm text-[#8B5CF6]/70">
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
