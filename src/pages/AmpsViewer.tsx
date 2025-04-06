import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { toast } from "sonner";
import SearchFilterBar from "@/components/amps/SearchFilterBar";
import MessagesTable from "@/components/amps/MessagesTable";
import MessageDetailsDrawer from "@/components/amps/MessageDetailsDrawer";
import { AmpsMessage, sampleAmpsData, messageTypes } from "@/components/amps/ampsData";

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

const AmpsViewer = () => {
  const [ampsMessages, setAmpsMessages] = useState<AmpsMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<AmpsMessage | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { currentEnvironment } = useEnvironment();
  
  const itemsPerPage = 10;

  // Load initial data
  useEffect(() => {
    const fetchAmpsData = async () => {
      setIsLoading(true);
      try {
        // Use the actual API endpoint to fetch server details
        const apiUrl = "http://localhost:8095/api/gridgain/dcserverdetails";
        const payload = {
          CallId: "temp",
          Env: currentEnvironment.name || "temp2"
        };
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json() as GridGainApiResponse;
        
        // Convert API response to AmpsMessage format
        const serverMessages: AmpsMessage[] = data.ServerDetails.map((detail, index) => ({
          id: `api-server-${index}`,
          workflowId: detail.HostId,
          type: "DC AMPS",
          status: data.Result === "success" ? "Completed" : "Failed",
          timestamp: new Date().toISOString(),
          details: `DC: ${detail.DcName}, Host URI: ${detail.DcUri}`,
          environment: currentEnvironment.name,
          data: { serverName: detail.DcName, url: detail.DcUri }
        }));
        
        // For demonstration purposes, also fetch DC records keys
        try {
          const dcRecordsUrl = "http://localhost:8095/api/gridgain/dcrecordskeys";
          const dcRecordsResponse = await fetch(dcRecordsUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          
          if (dcRecordsResponse.ok) {
            const dcData = await dcRecordsResponse.json();
            console.log("DC Records Keys:", dcData);
            // Could potentially use this data in the future
          }
        } catch (dcError) {
          console.error("Error fetching DC records keys:", dcError);
        }
        
        if (serverMessages.length > 0) {
          setAmpsMessages(serverMessages);
          toast.success(`Loaded ${serverMessages.length} AMPS entries from API`);
        } else {
          // Fallback to sample data if no server details in API response
          setAmpsMessages(sampleAmpsData);
          toast.info("No AMPS entries found in API response, using sample data");
        }
      } catch (error) {
        console.error("Error fetching AMPS data:", error);
        toast.error("Failed to fetch AMPS data. Using sample data.");
        setAmpsMessages(sampleAmpsData);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAmpsData();
  }, [currentEnvironment.name]);

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
    
    setIsLoading(true);
    
    // Simulate API call with a timeout
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const filteredData = ampsMessages.filter(
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
                {isLoading ? "Loading data from API..." : `${filteredMessages.length} message(s) found`}
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
