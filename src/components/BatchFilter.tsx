
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem 
} from "@/components/ui/dropdown-menu";

interface BatchFilterProps {
  onSearchChange: (value: string) => void;
  onStatusFilter?: (statuses: string[]) => void;
  statuses?: string[];
  selectedStatuses?: string[];
}

const BatchFilter = ({
  onSearchChange,
  onStatusFilter,
  statuses = [],
  selectedStatuses = []
}: BatchFilterProps) => {
  // Toggle status selection
  const toggleStatus = (status: string) => {
    if (!onStatusFilter) return;
    
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    
    onStatusFilter(newStatuses);
  };

  // Check if a status is selected
  const isStatusSelected = (status: string) => selectedStatuses.includes(status);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex items-center flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search batch jobs..."
          className="pl-8"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {statuses.length > 0 && onStatusFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={isStatusSelected(status)}
                onCheckedChange={() => toggleStatus(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default BatchFilter;
