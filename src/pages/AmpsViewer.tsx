
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
import { Search } from "lucide-react";
import { useEnvironment } from "@/contexts/EnvironmentContext";

// Sample data type for Amps messages
interface AmpsMessage {
  id: string;
  workflowId: string;
  timestamp: string;
  details: string;
  status: string;
}

// Sample data for demonstration
const sampleAmpsData: AmpsMessage[] = [
  {
    id: "1",
    workflowId: "WK1001",
    timestamp: "2023-09-15T10:30:00Z",
    details: JSON.stringify({ message: "Process started", action: "init" }, null, 2),
    status: "completed"
  },
  {
    id: "2",
    workflowId: "WK1002",
    timestamp: "2023-09-15T11:15:00Z",
    details: JSON.stringify({ message: "Data processing", action: "process", items: 150 }, null, 2),
    status: "running"
  },
  {
    id: "3",
    workflowId: "WK1003",
    timestamp: "2023-09-15T12:00:00Z",
    details: JSON.stringify({ message: "Error in data validation", action: "validate", error: "Invalid format" }, null, 2),
    status: "failed"
  }
];

const AmpsViewer = () => {
  const [ampsMessages, setAmpsMessages] = useState<AmpsMessage[]>(sampleAmpsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<AmpsMessage | null>(null);
  const { currentEnvironment } = useEnvironment();

  // Filter messages based on search term
  const filteredMessages = ampsMessages.filter(message => 
    message.workflowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle item click to show details
  const handleRowClick = (message: AmpsMessage) => {
    setSelectedMessage(message);
  };

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
          const parsedMessages = JSON.parse(content) as AmpsMessage[];
          setAmpsMessages(parsedMessages);
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
            <h1 className="text-2xl font-semibold tracking-tight">Amps Message Viewer</h1>
            <div className="text-sm text-muted-foreground">
              Environment: <span className="font-medium">{currentEnvironment.name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by workflow ID, status, or message content..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleImportMessages}>Import Messages</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Messages table */}
            <div className="md:col-span-2">
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
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMessages.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
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
            
            {/* Message details */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Message Details</CardTitle>
                  <CardDescription>
                    {selectedMessage ? `Workflow ${selectedMessage.workflowId}` : 'Select a message to view details'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedMessage ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Workflow ID</h3>
                        <p className="text-sm">{selectedMessage.workflowId}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Timestamp</h3>
                        <p className="text-sm">{new Date(selectedMessage.timestamp).toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Status</h3>
                        <p className="text-sm">{selectedMessage.status}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Details</h3>
                        <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-80">
                          {selectedMessage.details}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                      Select a message to view details
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AmpsViewer;
