"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    setDebouncedTerm('');
  };
  
  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [searchTerm]);
  
  // Trigger search when debounced term changes
  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <Input
        type="text"
        placeholder="Search by image name..."
        value={searchTerm}
        onChange={handleChange}
        className={cn(
          "pl-10 pr-10 h-11",
          searchTerm && "pr-8"
        )}
      />
      
      {searchTerm && (
        <Button
          variant="ghost" 
          size="icon"
          onClick={handleClear}
          className="absolute inset-y-0 right-1 flex items-center px-3 h-full"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}