"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-[#8B5CF6]/20 transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-[#FBBF24] group-hover:text-[#F59E0B] transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-[#8B5CF6] group-hover:text-[#7C3AED] transition-colors" />
      )}
    </button>
  );
}
