"use client";

import { useState, useMemo } from "react";
import { prisma } from "@/lib/db";
import { CategorySection } from "@/components/CategorySection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link2 } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";

interface Link {
  id: string;
  name: string;
  url: string;
  description?: string | null;
  favicon?: string | null;
  order: number;
}

interface Category {
  id: string;
  name: string;
  order: number;
  links: Link[];
}

interface NavigationContentProps {
  categories: Category[];
}

export function NavigationContent({ categories }: NavigationContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        links: category.links.filter(
          (link) =>
            link.name.toLowerCase().includes(query) ||
            link.description?.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.links.length > 0);
  }, [categories, searchQuery]);

  return (
    <div className="min-h-screen relative">
      <header className="sticky top-0 z-50 w-full">
        <div className="container">
          <div className="glass rounded-2xl mt-4 px-6 py-3 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
                  <Link2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg gradient-text">导航</span>
              </div>
              <ThemeToggle />
            </div>
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </header>
      <main className="container py-8 relative z-10">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center mb-6">
              <Link2 className="h-10 w-10 text-[#8B5CF6]" />
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              {searchQuery ? "没有找到匹配的链接" : "还没有添加任何链接"}
            </p>
            <p className="text-sm text-[#8B5CF6]/70">
              {searchQuery ? "尝试其他关键词" : "访问 /admin 添加分类和链接"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map((category) => (
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
