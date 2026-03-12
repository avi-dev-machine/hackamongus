"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-neon-cyan" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-neon-cyan/50 rounded-full bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all sm:text-sm"
        placeholder="Search for your team..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
