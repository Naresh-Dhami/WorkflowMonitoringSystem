
import { useState } from "react";
import Header from "@/components/Header";
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
import { Search, Filter, X } from "lucide-react";
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

// Sample data type for Grid Gain messages
interface GridGainMessage {
  id: string;
  workflowId: string;
  timestamp: string;
  details: string;
  status: string;
  type: string;
  environment?: string;
}

// Sample data for demonstration
const sampleGridGainData: GridGainMessage[] = [
  {
    id: "1",
    workflowId: "WK2001",
    timestamp: "2023-09-15T10:30:00Z",
    details: JSON.stringify({ 
      operation: "cache-put", 
      key: "customer-123", 
      value: { name: "John Doe", age: 35, status: "active" }
    }, null, 2),
    status: "completed",
    type: "cache-operation",
    environment: "DEV"
  },
  {
    id: "2",
    workflowId: "WK2002",
    timestamp: "2023-09-15T11:15:00Z",
    details: JSON.stringify({ 
      operation: "compute-task", 
      nodes: 5, 
      duration: 325, 
      result: "success" 
    }, null, 2),
    status: "completed",
    type: "compute-task",
    environment: "SIT"
  },
  {
    id: "3",
    workflowId: "WK2003",
    timestamp: "2023-09-15T12:00:00Z",
    details: JSON.stringify({ 
      operation: "cluster-rebalance", 
      nodes: 4, 
      partitions: 128, 
      progress: 0.75
    }, null, 2),
    status: "running",
    type: "cluster-operation",
    environment: "QA"
  },
  {
    id: "4",
    workflowId: "WK2004",
    timestamp: "2023-09-15T12:45:00Z",
    details: JSON.stringify({ 
      operation: "cache-get", 
      key: "product-456", 
      error: "Cache entry not found" 
    }, null, 2),
    status: "failed",
    type: "cache-operation",
    environment: "UAT"
  }
];

// Available message types for filtering
const messageTypes = [
  "cache-operation",
  "compute-task",
  "cluster-operation"
];

const GridGainViewer = () => {
  const [gridGainMessages, setGridGainMessages] = useState<GridGainMessage[]>(sampleGridGainData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<GridGainMessage | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { currentEnvironment } = useEnvironment();

  // Filter messages based on search term and selected types
  const filteredMessages = gridGainMessages.filter(message => {
    const matchesSearch = 
      message.workflowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.environment && message.environment.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(message.type);
    
    return matchesSearch && matchesType;
  });

  // Handle item click to show details
  const handleRowClick = (message: GridGainMessage) => {
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

  // Handle file import for messages (placeholder)
  const handleImportMessages = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;
      
      const file = target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsedMessages = JSON.parse(content) as GridGainMessage[];
          setGridGainMessages(parsedMessages);
        } catch (error) {
          console.error('Failed to import messages:', error);
        }
      };
      
      reader.readAsText(file);
    };
    input.click();
  };

  // Dummy functions for new process, import config, export config
  const dummyFunction = () => {};

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onNewProcess={dummyFunction} 
        onImportConfig={dummyFunction} 
        onExportConfig={dummyFunction} 
      />
      
      <main className="max-w-6xl mx-auto pt-24 px-6 pb-16">
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-tight">Grid Gain Message Viewer</h1>
            <div className="text-sm text-muted-foreground">
              Environment: <span className="font-medium">{currentEnvironment.name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by workflow ID, status, environment, or message content..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
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
            
            <Button onClick={handleImportMessages}>Import Messages</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Grid Gain Messages</CardTitle>
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
                    {filteredMessages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No messages found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMessages.map((message) => (
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

export default GridGainViewer;
