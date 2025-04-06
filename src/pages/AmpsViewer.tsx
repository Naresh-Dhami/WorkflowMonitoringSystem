
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { toast } from "sonner";
import SearchFilterBar from "@/components/amps/SearchFilterBar";
import MessagesTable from "@/components/amps/MessagesTable";
import MessageDetailsDrawer from "@/components/amps/MessageDetailsDrawer";
import { AmpsMessage, sampleAmpsData, messageTypes } from "@/components/amps/ampsData";

interface AmpsEntry {
  serverName: string;
  url: string;
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
        // In a real environment, you would fetch from the actual API
        // const response = await fetch('your-amps-api-endpoint');
        // const data = await response.json();
        
        // For demonstration, using data similar to the screenshot
        const rrAmpsList = [
          { serverName: "RR CO AMPS - PROD_XAE_CO_RR", url: "WPPRA89A0460.wellsfargo.com:8017,8071,8079" },
          { serverName: "RR Relayer - PROD_XAE_RELAY", url: "WPPRA88A0460.wellsfargo.com:8017,8071,8079" }
        ];
        
        const dcAmpsList = [
          { serverName: "DC1 - PROD_XAE_DC6", url: "WPPRA99A0396.wellsfargo.com:9023" },
          { serverName: "DC10 - PROD_XAE_DC10", url: "WPVRA85A0011.wellsfargo.com:9023" },
          { serverName: "DC11 - PROD_XAE_DC11", url: "WPVRA85A0012.wellsfargo.com:9023" },
          { serverName: "DC12 - PROD_XAE_DC12", url: "WPVRA85A0013.wellsfargo.com:9023" },
          { serverName: "DC13 - PROD_XAE_DC13", url: "WPVRA85A0014.wellsfargo.com:9023" },
          { serverName: "DC14 - PROD_XAE_DC14", url: "wpvra85a0015.wellsfargo.com:9023" },
          { serverName: "DC15 - PROD_XAE_DC15", url: "wppra90a0460.wellsfargo.com:9023" }
        ];
        
        // Convert to AmpsMessage format
        const rrMessages: AmpsMessage[] = rrAmpsList.map((entry, index) => ({
          id: `rr-${index}`,
          workflowId: `RR-${index + 1}`,
          type: "RR AMPS",
          status: "Completed",
          timestamp: new Date().toISOString(),
          details: `${entry.serverName} (${entry.url})`,
          environment: "Production",
          data: { serverName: entry.serverName, url: entry.url }
        }));
        
        const dcMessages: AmpsMessage[] = dcAmpsList.map((entry, index) => ({
          id: `dc-${index}`,
          workflowId: entry.serverName.split(' - ')[0],
          type: "DC AMPS",
          status: "Completed",
          timestamp: new Date().toISOString(),
          details: `${entry.serverName} (${entry.url})`,
          environment: "Production",
          data: { serverName: entry.serverName, url: entry.url }
        }));
        
        const combinedMessages = [...rrMessages, ...dcMessages];
        setAmpsMessages(combinedMessages.length > 0 ? combinedMessages : sampleAmpsData);
        toast.success(`Loaded ${combinedMessages.length} AMPS entries`);
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

export default AmpsViewer;
