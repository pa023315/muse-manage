import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid3X3, List, SlidersHorizontal } from "lucide-react";

interface ListControlsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  viewMode: 'cards' | 'rows';
  onViewModeChange: (mode: 'cards' | 'rows') => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: Array<{ value: string; label: string }>;
  onFilterClick?: () => void;
}

export default function ListControls({
  searchValue,
  onSearchChange,
  searchPlaceholder = "搜尋...",
  viewMode,
  onViewModeChange,
  sortValue,
  onSortChange,
  sortOptions,
  onFilterClick,
}: ListControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 bg-background">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Filter Button */}
        {onFilterClick && (
          <Button variant="outline" size="sm" onClick={onFilterClick}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            篩選
          </Button>
        )}

        {/* View Mode Toggle */}
        <div className="flex rounded-md border border-border">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('cards')}
            className="rounded-r-none border-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'rows' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('rows')}
            className="rounded-l-none border-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Sort */}
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}