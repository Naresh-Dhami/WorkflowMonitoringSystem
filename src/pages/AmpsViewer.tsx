
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
      <div className="bg-[#ea384c] py-6 mb-6">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">Amps Message Viewer</h1>
          <div className="text-sm text-white/80 mt-1">
            Environment: <span className="font-medium">{currentEnvironment.name}</span>
          </div>
        </div>
      </div>
      
      <main className="max-w-6xl mx-auto px-6 pb-16 pt-4">
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader className="py-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle>Amps Messages</CardTitle>
                <div className="w-full md:w-auto">
                  <SearchFilterBar
                    onSearchChange={setSearchTerm}
                    onTypeFilter={setSelectedTypes}
                    onWorkflowSearch={handleSearchWorkflow}
                    messageTypes={messageTypes}
                    selectedTypes={selectedTypes}
                  />
                </div>
              </div>
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
