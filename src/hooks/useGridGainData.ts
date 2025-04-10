import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GridGainMessage, sampleGridGainData } from "@/components/gridgain/GridGainData";
import { GridGainApiResponse, ServerDetail } from "@/types/gridgain";
import { useEnvironment } from "@/contexts/EnvironmentContext";

export function useGridGainData(environmentName: string) {
  const { currentEnvironment } = useEnvironment();
  const [gridGainMessages, setGridGainMessages] = useState<GridGainMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<GridGainMessage | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const itemsPerPage = 20; // Updated to show 20 items per page
  
  // Load initial data from API
  useEffect(() => {
    const fetchGridGainData = async () => {
      setIsLoading(true);
      try {
        // Use the environment's gridGainUrl if available
        const apiUrl = currentEnvironment.gridGainUrl 
          ? `${currentEnvironment.gridGainUrl}/dcserverdetails` 
          : "http://localhost:8095/api/gridgain/dcserverdetails";
          
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
        
        // Convert API response to GridGainMessage format
        const messages: GridGainMessage[] = data.ServerDetails.map((detail, index) => ({
          id: `server-${index}`,
          workflowId: detail.HostId,
          type: "Server",
          status: data.Result === "success" ? "Completed" : "Failed",
          timestamp: new Date().toISOString(),
          details: `DC: ${detail.DcName}, URI: ${detail.DcUri}`,
          environment: environmentName,
          data: detail
        }));
        
        if (messages.length > 0) {
          setGridGainMessages(messages);
          toast.success(`Loaded ${messages.length} server details from API`);
        } else {
          // Fallback to sample data if no messages in API response
          setGridGainMessages(sampleGridGainData);
          toast.info("No server details found in API response, using sample data");
        }
      } catch (error) {
        console.error("Error fetching GridGain data:", error);
        toast.error("Failed to fetch server details. Using sample data.");
        setGridGainMessages(sampleGridGainData);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Also fetch DC records keys
    const fetchDcRecordsKeys = async () => {
      try {
        const apiUrl = currentEnvironment.gridGainUrl
          ? `${currentEnvironment.gridGainUrl}/dcrecordskeys`
          : "http://localhost:8095/api/gridgain/dcrecordskeys";
          
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
          throw new Error(`DC records API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("DC Records Keys:", data);
        // We're just logging this data for now, could be used in the future
        
      } catch (error) {
        console.error("Error fetching DC records keys:", error);
      }
    };
    
    fetchGridGainData();
    fetchDcRecordsKeys();
  }, [environmentName, currentEnvironment]);

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
