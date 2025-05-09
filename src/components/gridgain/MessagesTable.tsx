
import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GridGainMessage } from "./GridGainData";

interface MessagesTableProps {
  messages: GridGainMessage[];
  currentPage: number;
  totalPages: number;
  environmentName: string;
  onRowClick: (message: GridGainMessage) => void;
  onDetailButtonClick: (message: GridGainMessage) => void; // Added this prop
  onPageChange: (page: number) => void;
}

const MessagesTable = ({
  messages,
  currentPage,
  totalPages,
  environmentName,
  onRowClick,
  onDetailButtonClick, // Added this prop
  onPageChange
}: MessagesTableProps) => {
  const [sortField, setSortField] = useState<keyof GridGainMessage>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  // Handle sorting
  const handleSort = (field: keyof GridGainMessage) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort messages
  const sortedMessages = [...messages].sort((a, b) => {
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

  // Toggle selection of a message
  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking the checkbox
    
    setSelectedMessages(prev => 
      prev.includes(id) 
        ? prev.filter(messageId => messageId !== id)
        : [...prev, id]
    );
  };

  // Check if a message is selected
  const isSelected = (id: string) => selectedMessages.includes(id);

  // Navigate to a different page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead 
                className={cn("sortable-header", sortField === "workflowId" && `sort-${sortDirection}`)}
                onClick={() => handleSort("workflowId")}
              >
                Host ID
              </TableHead>
              <TableHead 
                className={cn("sortable-header", sortField === "details" && `sort-${sortDirection}`)}
                onClick={() => handleSort("details")}
              >
                DC Name
              </TableHead>
              <TableHead 
                className={cn("sortable-header", sortField === "status" && `sort-${sortDirection}`)}
                onClick={() => handleSort("status")}
              >
                DC URI
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead> {/* Added Actions column */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center"> {/* Updated colspan to 5 */}
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              sortedMessages.map((message) => {
                const serverDetail = message.data || {
                  HostId: message.workflowId,
                  DcName: "N/A",
                  DcUri: "N/A"
                };
                
                return (
                  <TableRow 
                    key={message.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onRowClick(message)}
                  >
                    <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={isSelected(message.id)} 
                        onCheckedChange={() => {}}
                        onClick={(e) => toggleSelection(message.id, e)} 
                      />
                    </TableCell>
                    <TableCell className="font-medium py-2">
                      {serverDetail.HostId}
                    </TableCell>
                    <TableCell className="py-2">
                      {serverDetail.DcName}
                    </TableCell>
                    <TableCell className="py-2">
                      {serverDetail.DcUri}
                    </TableCell>
                    <TableCell className="py-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          onDetailButtonClick(message);
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
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

export default MessagesTable;
