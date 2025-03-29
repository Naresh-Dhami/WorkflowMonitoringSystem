
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { toast } from "sonner";
import SearchFilterBar from "@/components/amps/SearchFilterBar";
import MessagesTable from "@/components/amps/MessagesTable";
import MessageDetailsDrawer from "@/components/amps/MessageDetailsDrawer";
import { AmpsMessage, sampleAmpsData, messageTypes } from "@/components/amps/ampsData";

const AmpsViewer = () => {
  const [ampsMessages, setAmpsMessages] = useState<AmpsMessage[]>(sampleAmpsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<AmpsMessage | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  // Handle search by workflow ID
  const handleSearchWorkflow = async (workflowId: string) => {
    if (!workflowId.trim()) {
      toast.error("Please enter a workflow ID to search");
      return;
    }
    
    // Simulate API call with a timeout
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const filteredData = sampleAmpsData.filter(
          message => message.workflowId.toLowerCase().includes(workflowId.toLowerCase())
        );
        
        setAmpsMessages(filteredData);
        setCurrentPage(1);
        
        if (filteredData.length === 0) {
          toast.error(`No messages found for workflow ID: ${workflowId}`);
        } else {
          toast.success(`Found ${filteredData.length} messages for workflow ID: ${workflowId}`);
        }
        resolve();
      }, 800);
    });
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
          
          <SearchFilterBar
            onSearchChange={setSearchTerm}
            onTypeFilter={setSelectedTypes}
            onWorkflowSearch={handleSearchWorkflow}
            messageTypes={messageTypes}
            selectedTypes={selectedTypes}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Amps Messages</CardTitle>
              <CardDescription>
                {filteredMessages.length} message(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessagesTable
                messages={paginatedMessages}
                currentPage={currentPage}
                totalPages={totalPages}
                environmentName={currentEnvironment.name}
                onRowClick={handleRowClick}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <MessageDetailsDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        message={selectedMessage}
        environmentName={currentEnvironment.name}
      />
    </div>
  );
};

export default AmpsViewer;
