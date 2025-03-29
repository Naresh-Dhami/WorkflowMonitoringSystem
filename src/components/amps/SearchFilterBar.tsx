
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface SearchFilterBarProps {
  onSearchChange: (value: string) => void;
  onTypeFilter: (types: string[]) => void;
  onWorkflowSearch: (workflowId: string) => void;
  messageTypes: string[];
  selectedTypes: string[];
}

const SearchFilterBar = ({
  onSearchChange,
  onTypeFilter,
  onWorkflowSearch,
  messageTypes,
  selectedTypes
}: SearchFilterBarProps) => {
  const [workflowSearch, setWorkflowSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Toggle type selection
  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    onTypeFilter(newTypes);
  };

  // Check if a type is selected
  const isTypeSelected = (type: string) => selectedTypes.includes(type);

  // Handle search by workflow ID
  const handleSearchWorkflow = async () => {
    if (!workflowSearch.trim()) {
      toast.error("Please enter a workflow ID to search");
      return;
    }
    
    setIsSearching(true);
    
    try {
      await onWorkflowSearch(workflowSearch);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Filter results..."
          className="pl-8"
          onChange={(e) => onSearchChange(e.target.value)}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {messageTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={isTypeSelected(type)}
                onCheckedChange={() => toggleType(type)}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by workflow ID..."
          value={workflowSearch}
          onChange={(e) => setWorkflowSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchWorkflow()}
        />
        <Button onClick={handleSearchWorkflow} disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
