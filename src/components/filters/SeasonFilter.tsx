import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SeasonFilterProps {
  value: string;
  onChange: (value: string) => void;
  seasons: number[];
  placeholder?: string;
  className?: string;
}

export const SeasonFilter = ({ 
  value, 
  onChange, 
  seasons,
  placeholder = "All Seasons",
  className 
}: SeasonFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {seasons.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};