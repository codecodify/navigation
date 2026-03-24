"use client";

import { LinkCard } from "./LinkCard";

interface Link {
  id: string;
  name: string;
  url: string;
  description?: string | null;
  favicon?: string | null;
}

interface CategorySectionProps {
  name: string;
  links: Link[];
}

export function CategorySection({ name, links }: CategorySectionProps) {
  if (links.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-[#8B5CF6]/50 to-transparent" />
        <h2 className="text-lg font-semibold gradient-text">
          {name}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-[#06B6D4]/50 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <LinkCard key={link.id} {...link} />
        ))}
      </div>
    </section>
  );
}
