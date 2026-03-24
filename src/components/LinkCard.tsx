"use client";

import { ExternalLink, Globe } from "lucide-react";

interface LinkCardProps {
  name: string;
  url: string;
  description?: string | null;
  favicon?: string | null;
}

export function LinkCard({ name, url, description, favicon }: LinkCardProps) {
  const faviconUrl = favicon || `https://www.google.com/s2/favicons?domain=${url}&sz=64`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="tech-card rounded-xl p-4 flex items-start gap-3 hover-glow">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center overflow-hidden border border-[#8B5CF6]/20 group-hover:border-[#8B5CF6]/40 transition-all duration-300">
          {favicon ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-6 h-6"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <Globe className={`w-6 h-6 text-[#8B5CF6] ${favicon ? "hidden" : ""}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground group-hover:text-[#8B5CF6] transition-colors duration-300">
              {name}
            </span>
            <ExternalLink className="w-3 h-3 text-[#8B5CF6]/60 flex-shrink-0" />
          </div>
          {description && (
            <p className="text-sm text-muted-foreground/80 truncate mt-1 selectable" title={description}>
              {description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
