import { Button } from "@/components/ui/button";

export interface FilterOption {
  id: string;
  label: string;
  active: boolean;
}

interface FilterButtonsProps {
  filters: FilterOption[];
  onFilterClick: (filterId: string) => void;
}

export default function FilterButtons({ filters, onFilterClick }: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={filter.active ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterClick(filter.id)}
          className="h-8"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}