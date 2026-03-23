"use client";

import { ExternalLink, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LinkCardProps {
  name: string;
  url: string;
  description?: string | null;
  favicon?: string | null;
}

export function LinkCard({ name, url, description, favicon }: LinkCardProps) {
  const faviconUrl = favicon || `https://www.google.com/s2/favicons?domain=${url}&sz=64`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer h-full">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
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
            <Globe className={`w-5 h-5 text-muted-foreground ${favicon ? "hidden" : ""}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-medium truncate">{name}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            </div>
            {description && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
