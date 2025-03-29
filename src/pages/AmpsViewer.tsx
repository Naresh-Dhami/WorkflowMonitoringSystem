
import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem 
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from "@/components/ui/drawer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

// Sample data type for Amps messages
interface AmpsMessage {
  id: string;
  workflowId: string;
  timestamp: string;
  details: string;
  status: string;
  type: string;
  environment?: string;
}

// Sample data for demonstration
const sampleAmpsData: AmpsMessage[] = [
  {
    id: "1",
    workflowId: "WK1001",
    timestamp: "2023-09-15T10:30:00Z",
    details: JSON.stringify({ message: "Process started", action: "init" }, null, 2),
    status: "completed",
    type: "init",
    environment: "DEV"
  },
  {
    id: "2",
    workflowId: "WK1002",
    timestamp: "2023-09-15T11:15:00Z",
    details: JSON.stringify({ message: "Data processing", action: "process", items: 150 }, null, 2),
    status: "running",
    type: "process",
    environment: "SIT"
  },
  {
    id: "3",
    workflowId: "WK1003",
    timestamp: "2023-09-15T12:00:00Z",
    details: JSON.stringify({ message: "Error in data validation", action: "validate", error: "Invalid format" }, null, 2),
    status: "failed",
    type: "validate",
    environment: "QA"
  },
  // Add more sample data for pagination testing
  ...[...Array(15)].map((_, i) => ({
    id: `${i + 4}`,
    workflowId: `WK${1004 + i}`,
    timestamp: new Date(2023, 8, 15, 12 + Math.floor(i/2), (i % 2) * 30).toISOString(),
    details: JSON.stringify({ message: `Sample message ${i + 4}`, action: i % 3 === 0 ? "init" : i % 3 === 1 ? "process" : "validate" }, null, 2),
    status: i % 3 === 0 ? "completed" : i % 3 === 1 ? "running" : "failed",
    type: i % 3 === 0 ? "init" : i % 3 === 1 ? "process" : "validate",
    environment: i % 3 === 0 ? "DEV" : i % 3 === 1 ? "SIT" : "QA"
  }))
];

// Available message types for filtering
const messageTypes = [
  "init",
  "process",
  "validate"
];

const AmpsViewer = () => {
  const [ampsMessages, setAmpsMessages] = useState<AmpsMessage[]>(sampleAmpsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [workflowSearch, setWorkflowSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<AmpsMessage | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { currentEnvironment } = useEnvironment();
  
  const itemsPerPage = 10;

  // Filter messages based on search term and selected types
  const filteredMessages = ampsMessages.filter(message => {
    const matchesSearch = 
      message.workflowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.environment && message.environment.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(message.type);
    
    return matchesSearch && matchesType;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + itemsPerPage);

  // Handle item click to show details
  const handleRowClick = (message: AmpsMessage) => {
    setSelectedMessage(message);
    setIsDrawerOpen(true);
  };

  // Toggle type selection
  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
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
    
    // Simulate API call with a timeout
    setTimeout(() => {
      const filteredData = sampleAmpsData.filter(
        message => message.workflowId.toLowerCase().includes(workflowSearch.toLowerCase())
      );
      
      setAmpsMessages(filteredData);
      setCurrentPage(1);
      setIsSearching(false);
      
      if (filteredData.length === 0) {
        toast.error(`No messages found for workflow ID: ${workflowSearch}`);
      } else {
        toast.success(`Found ${filteredData.length} messages for workflow ID: ${workflowSearch}`);
      }
    }, 800);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto pt-6 px-6 pb-16">
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-tight">Amps Message Viewer</h1>
            <div className="text-sm text-muted-foreground">
              Environment: <span className="font-medium">{currentEnvironment.name}</span>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Filter results..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          
          <Card>
            <CardHeader>
              <CardTitle>Amps Messages</CardTitle>
              <CardDescription>
                {filteredMessages.length} message(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workflow ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMessages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No messages found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedMessages.map((message) => (
                        <TableRow 
                          key={message.id} 
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => handleRowClick(message)}
                        >
                          <TableCell>{message.workflowId}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                              {message.type}
                            </span>
                          </TableCell>
                          <TableCell>{message.environment || currentEnvironment.name}</TableCell>
                          <TableCell>{new Date(message.timestamp).toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.status === 'completed' ? 'bg-green-100 text-green-800' :
                              message.status === 'running' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {message.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink 
                                isActive={page === currentPage}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        // Add ellipsis for skipped pages
                        if (page === 2 || page === totalPages - 1) {
                          return (
                            <PaginationItem key={`ellipsis-${page}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader className="text-left">
              <DrawerTitle className="flex items-center justify-between">
                Message Details
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </DrawerTitle>
              <DrawerDescription>
                {selectedMessage ? `Workflow ${selectedMessage.workflowId}` : ''}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-8">
              {selectedMessage && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Workflow ID</h3>
                      <p className="text-sm">{selectedMessage.workflowId}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Type</h3>
                      <p className="text-sm">{selectedMessage.type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Environment</h3>
                      <p className="text-sm">{selectedMessage.environment || currentEnvironment.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Status</h3>
                      <p className="text-sm">{selectedMessage.status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Timestamp</h3>
                      <p className="text-sm">{new Date(selectedMessage.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Details</h3>
                    <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-80 whitespace-pre-wrap">
                      {selectedMessage.details}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AmpsViewer;
