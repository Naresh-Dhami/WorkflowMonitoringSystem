
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AmpsMessage, sampleAmpsData } from "@/components/amps/ampsData";

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

export function useAmpsData(environmentName: string) {
  const [ampsMessages, setAmpsMessages] = useState<AmpsMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<AmpsMessage | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
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
          Env: environmentName || "temp2"
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
          environment: environmentName,
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
  }, [environmentName]);

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

  return {
    paginatedMessages,
    isLoading,
    filteredMessages,
    searchTerm,
    setSearchTerm,
    selectedTypes,
    setSelectedTypes,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedMessage,
    setSelectedMessage,
    isDrawerOpen,
    setIsDrawerOpen,
    handleSearchWorkflow
  };
}
