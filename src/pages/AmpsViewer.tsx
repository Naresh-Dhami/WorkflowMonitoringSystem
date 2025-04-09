
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { messageTypes } from "@/components/amps/ampsData";
import MessageDetailsDrawer from "@/components/amps/MessageDetailsDrawer";
import AmpsHeader from "@/components/amps/AmpsHeader";
import AmpsContent from "@/components/amps/AmpsContent";
import { useAmpsData } from "@/hooks/useAmpsData";
import { useEffect } from "react";
import { toast } from "sonner";

const AmpsViewer = () => {
  const { currentEnvironment } = useEnvironment();
  
  useEffect(() => {
    if (!currentEnvironment.ampsUrl) {
      toast.warning("No AMPS URL configured for this environment. Please update the environment settings.", {
        duration: 5000,
      });
    }
  }, [currentEnvironment]);
  
  const {
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
  } = useAmpsData(currentEnvironment.name);

  // Handle item click to show details
  const handleRowClick = (message: any) => {
    setSelectedMessage(message);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AmpsHeader 
        environmentName={currentEnvironment.name} 
        ampsUrl={currentEnvironment.ampsUrl} 
      />
      
      <AmpsContent
        isLoading={isLoading}
        filteredMessages={filteredMessages}
        paginatedMessages={paginatedMessages}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTypes={selectedTypes}
        onTypeFilter={setSelectedTypes}
        currentPage={currentPage}
        totalPages={totalPages}
        environmentName={currentEnvironment.name}
        onRowClick={handleRowClick}
        onPageChange={setCurrentPage}
        onWorkflowSearch={handleSearchWorkflow}
        messageTypes={messageTypes}
        ampsUrl={currentEnvironment.ampsUrl}
      />

      <MessageDetailsDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        message={selectedMessage}
        environmentName={currentEnvironment.name}
        ampsUrl={currentEnvironment.ampsUrl}
      />
    </div>
  );
};

export default AmpsViewer;
