
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { toast } from "sonner";
import SearchFilterBar from "@/components/gridgain/SearchFilterBar";
import MessagesTable from "@/components/gridgain/MessagesTable";
import MessageDetailsDrawer from "@/components/gridgain/MessageDetailsDrawer";
import { GridGainMessage, sampleGridGainData, messageTypes } from "@/components/gridgain/GridGainData";

interface ServerDetail {
  HostId: string;
  DcName: string;
  DcUri: string;
}

interface GridGainApiResponse {
  CallId: string;
  Result: string;
  ErrorDescription: string;
  ServerDetails: ServerDetail[];
}

const GridGainViewer = () => {
  const [gridGainMessages, setGridGainMessages] = useState<GridGainMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<GridGainMessage | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { currentEnvironment } = useEnvironment();
  
  const itemsPerPage = 10;

  // Load initial data from API
  useEffect(() => {
    const fetchGridGainData = async () => {
      setIsLoading(true);
      try {
        // For production, use the actual API endpoint
        const apiUrl = "http://localhost:8095/api/gridgain/dcserverdetails";
        const payload = {
          CallId: "temp",
          Env: "temp2"
        };
        
        // In a real environment, you would use this:
        // const response = await fetch(apiUrl, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(payload),
        // });
        
        // If the API is not available in development, use sample data
        // const data = await response.json() as GridGainApiResponse;
        
        // Simulate API response with sample data
        const data: GridGainApiResponse = {
          CallId: "temp",
          Result: "success",
          ErrorDescription: "done",
          ServerDetails: [
            {
              HostId: "wdpra96a0417",
              DcName: "DC1",
              DcUri: "wdpra96a0417"
            }
          ]
        };
        
        // Convert API response to GridGainMessage format
        const messages: GridGainMessage[] = data.ServerDetails.map((detail, index) => ({
          id: `server-${index}`,
          workflowId: detail.HostId,
          type: "Server",
          status: data.Result === "success" ? "Completed" : "Failed",
          timestamp: new Date().toISOString(),
          details: `DC: ${detail.DcName}, URI: ${detail.DcUri}`,
          environment: currentEnvironment.name,
          data: detail
        }));
        
        setGridGainMessages(messages.length > 0 ? messages : sampleGridGainData);
        toast.success(`Loaded ${messages.length} server details`);
      } catch (error) {
        console.error("Error fetching GridGain data:", error);
        toast.error("Failed to fetch server details. Using sample data.");
        setGridGainMessages(sampleGridGainData);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGridGainData();
  }, [currentEnvironment.name]);

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + itemsPerPage);

  // Handle item click to show details
  const handleRowClick = (message: GridGainMessage) => {
    setSelectedMessage(message);
    setIsDrawerOpen(true);
  };

  // Handle search by workflow ID
  const handleSearchWorkflow = async (workflowId: string) => {
    if (!workflowId.trim()) {
      toast.error("Please enter a workflow ID to search");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with a timeout
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const filteredData = gridGainMessages.filter(
          message => message.workflowId.toLowerCase().includes(workflowId.toLowerCase())
        );
        
        if (filteredData.length === 0) {
          toast.error(`No messages found for workflow ID: ${workflowId}`);
        } else {
          toast.success(`Found ${filteredData.length} messages for workflow ID: ${workflowId}`);
        }
        
        setCurrentPage(1);
        setIsLoading(false);
        resolve();
      }, 800);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#ea384c] py-6 mb-6">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">Grid Gain Message Viewer</h1>
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
                <CardTitle>Grid Gain Messages</CardTitle>
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
                {filteredMessages.length} message(s) found {isLoading && "• Loading..."}
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

export default GridGainViewer;
