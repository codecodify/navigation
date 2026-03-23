"use client";

import { LinkCard } from "./LinkCard";
import { Badge } from "@/components/ui/badge";

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
    <section className="mb-8">
      <Badge variant="outline" className="mb-3 text-sm px-3 py-1">
        {name}
      </Badge>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {links.map((link) => (
          <LinkCard key={link.id} {...link} />
        ))}
      </div>
    </section>
  );
}
