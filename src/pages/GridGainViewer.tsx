
import { useEnvironment } from "@/contexts/EnvironmentContext";
import MessageDetailsDrawer from "@/components/gridgain/MessageDetailsDrawer";
import { messageTypes } from "@/components/gridgain/GridGainData";
import GridGainHeader from "@/components/gridgain/GridGainHeader";
import GridGainContent from "@/components/gridgain/GridGainContent";
import { useGridGainData } from "@/hooks/useGridGainData";

const GridGainViewer = () => {
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
  } = useGridGainData(currentEnvironment.name);

  // Handle item click to show details - only for the detail button
  const handleDetailButtonClick = (message: any) => {
    setSelectedMessage(message);
    setIsDrawerOpen(true);
  };

  // Handle row click - this should not open the drawer
  const handleRowClick = (message: any) => {
    // Do nothing, as requested
    console.log("Row clicked, but drawer not opened");
  };

  return (
    <div className="min-h-screen bg-background">
      <GridGainHeader environmentName={currentEnvironment.name} />
      
      <GridGainContent
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
        onDetailButtonClick={handleDetailButtonClick}
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

export default GridGainViewer;
