"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "搜索链接..." }: SearchInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative transition-all duration-300 ${focused ? "glow-purple" : ""}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B5CF6]/60" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="pl-10 pr-10 glass bg-background/80"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B5CF6]/60 hover:text-[#8B5CF6] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
