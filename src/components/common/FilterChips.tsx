import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface FilterChip {
  key: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onRemoveFilter: (key: string) => void;
  onClearAll?: () => void;
}

export default function FilterChips({ filters = [], onRemoveFilter, onClearAll }: FilterChipsProps) {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-6 py-2 border-b border-border bg-muted/20">
      <span className="text-sm text-muted-foreground">篩選條件:</span>
      {filters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {filter.label}: {filter.value}
          <Button
            variant="ghost"
            size="icon"
            className="h-3 w-3 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onRemoveFilter(filter.key)}
          >
            <X className="h-2 w-2" />
          </Button>
        </Badge>
      ))}
      {filters.length > 1 && onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          清除所有
        </Button>
      )}
    </div>
  );
}