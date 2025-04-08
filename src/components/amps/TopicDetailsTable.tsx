
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface TopicDetail {
  id: string;
  topic: string;
  partition: number;
  offset: number;
  timestamp: string;
  status: string;
  message?: string;
}

interface TopicDetailsTableProps {
  topicDetails: TopicDetail[];
  currentPage: number;
  totalPages: number;
  onRowClick: (topicDetail: TopicDetail) => void;
  onPageChange: (page: number) => void;
}

const TopicDetailsTable: React.FC<TopicDetailsTableProps> = ({
  topicDetails,
  currentPage,
  totalPages,
  onRowClick,
  onPageChange
}) => {
  const [sortField, setSortField] = useState<keyof TopicDetail>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTopics, setFilteredTopics] = useState<TopicDetail[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Handle sorting
  const handleSort = (field: keyof TopicDetail) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and search topics
  useEffect(() => {
    let filtered = [...topicDetails];
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(topic => 
        topic.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (topic.message && topic.message.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(topic => topic.status === statusFilter);
    }
    
    // Sort the filtered list
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    
    setFilteredTopics(filtered);
  }, [topicDetails, searchTerm, statusFilter, sortField, sortDirection]);

  // Toggle selection of a topic detail
  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking the checkbox
    
    setSelectedTopics(prev => 
      prev.includes(id) 
        ? prev.filter(topicId => topicId !== id)
        : [...prev, id]
    );
  };

  // Check if a topic is selected
  const isSelected = (id: string) => selectedTopics.includes(id);

  // Navigate to a different page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 w-1/2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                {statusFilter ? `Status: ${statusFilter}` : "Filter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-[150] bg-white">
              <DropdownMenuItem onClick={() => setStatusFilter("Completed")} className="cursor-pointer">
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Running")} className="cursor-pointer">
                Running
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Failed")} className="cursor-pointer">
                Failed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Pending")} className="cursor-pointer">
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearFilters} className="cursor-pointer text-red-500">
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {filteredTopics.length} topics
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead 
                className={cn("sortable-header cursor-pointer", sortField === "topic" && `sort-${sortDirection}`)}
                onClick={() => handleSort("topic")}
              >
                Topic
              </TableHead>
              <TableHead 
                className={cn("sortable-header cursor-pointer", sortField === "partition" && `sort-${sortDirection}`)}
                onClick={() => handleSort("partition")}
              >
                Partition
              </TableHead>
              <TableHead 
                className={cn("sortable-header cursor-pointer", sortField === "offset" && `sort-${sortDirection}`)}
                onClick={() => handleSort("offset")}
              >
                Offset
              </TableHead>
              <TableHead 
                className={cn("sortable-header cursor-pointer", sortField === "status" && `sort-${sortDirection}`)}
                onClick={() => handleSort("status")}
              >
                Status
              </TableHead>
              <TableHead 
                className={cn("sortable-header cursor-pointer", sortField === "timestamp" && `sort-${sortDirection}`)}
                onClick={() => handleSort("timestamp")}
              >
                Timestamp
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTopics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  No topic details found
                </TableCell>
              </TableRow>
            ) : (
              filteredTopics.map((topic) => (
                <TableRow 
                  key={topic.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick(topic)}
                >
                  <TableCell className="py-2">
                    <Checkbox 
                      checked={isSelected(topic.id)} 
                      onCheckedChange={() => {}}
                      onClick={(e) => toggleSelection(topic.id, e)} 
                    />
                  </TableCell>
                  <TableCell className="font-medium py-2">{topic.topic}</TableCell>
                  <TableCell className="py-2">{topic.partition}</TableCell>
                  <TableCell className="py-2">{topic.offset}</TableCell>
                  <TableCell className="py-2">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
                      topic.status === "Completed" && "bg-green-100 text-green-800",
                      topic.status === "Running" && "bg-blue-100 text-blue-800",
                      topic.status === "Failed" && "bg-red-100 text-red-800",
                      topic.status === "Pending" && "bg-yellow-100 text-yellow-800"
                    )}>
                      {topic.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground py-2">
                    {new Date(topic.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopicDetailsTable;
