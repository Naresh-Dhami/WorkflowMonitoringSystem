
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { messageTypes } from "@/components/amps/ampsData";
import MessageDetailsDrawer from "@/components/amps/MessageDetailsDrawer";
import AmpsHeader from "@/components/amps/AmpsHeader";
import AmpsContent from "@/components/amps/AmpsContent";
import { useAmpsData } from "@/hooks/useAmpsData";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AmpsViewer = () => {
  const { currentEnvironment } = useEnvironment();
  
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
      <AmpsHeader environmentName={currentEnvironment.name} />
      
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
      />

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
