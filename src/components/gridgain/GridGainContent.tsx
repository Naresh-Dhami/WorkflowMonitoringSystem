
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import SearchFilterBar from "@/components/gridgain/SearchFilterBar";
import MessagesTable from "@/components/gridgain/MessagesTable";
import TopicDetailsTable, { TopicDetail } from "@/components/gridgain/TopicDetailsTable";
import { GridGainMessage } from "@/components/gridgain/GridGainData";

interface GridGainContentProps {
  isLoading: boolean;
  filteredMessages: GridGainMessage[];
  paginatedMessages: GridGainMessage[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTypes: string[];
  onTypeFilter: (types: string[]) => void;
  currentPage: number;
  totalPages: number;
  environmentName: string;
  onRowClick: (message: GridGainMessage) => void;
  onPageChange: (page: number) => void;
  onWorkflowSearch: (workflowId: string) => Promise<void>;
  messageTypes: string[];
}

const GridGainContent: React.FC<GridGainContentProps> = ({
  isLoading,
  filteredMessages,
  paginatedMessages,
  searchTerm,
  onSearchChange,
  selectedTypes,
  onTypeFilter,
  currentPage,
  totalPages,
  environmentName,
  onRowClick,
  onPageChange,
  onWorkflowSearch,
  messageTypes
}) => {
  // State for selected workflow and topic details
  const [selectedWorkflow, setSelectedWorkflow] = useState<GridGainMessage | null>(null);
  const [topicDetails, setTopicDetails] = useState<TopicDetail[]>([]);
  const [topicCurrentPage, setTopicCurrentPage] = useState(1);
  
  // Calculate total pages for topic details
  const topicItemsPerPage = 10;
  const topicTotalPages = Math.ceil(topicDetails.length / topicItemsPerPage);
  const topicStartIndex = (topicCurrentPage - 1) * topicItemsPerPage;
  const paginatedTopics = topicDetails.slice(topicStartIndex, topicStartIndex + topicItemsPerPage);

  // Handle workflow row click
  const handleWorkflowClick = (message: GridGainMessage) => {
    setSelectedWorkflow(message);
    
    // Generate sample topic details based on the selected workflow
    // In a real app, you would fetch these from an API
    const generatedTopics: TopicDetail[] = Array.from({ length: 15 }, (_, i) => ({
      id: `topic-${message.id}-${i}`,
      topic: `${message.type}.Topic.${i + 1}`,
      partition: Math.floor(Math.random() * 10),
      offset: Math.floor(Math.random() * 100000),
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      status: ["Completed", "Running", "Failed", "Pending"][Math.floor(Math.random() * 4)]
    }));
    
    setTopicDetails(generatedTopics);
    setTopicCurrentPage(1);
  };

  // Handle topic detail click
  const handleTopicClick = (topicDetail: TopicDetail) => {
    // Pass the topic details to the parent component to show in the drawer
    if (selectedWorkflow) {
      const enrichedMessage = {
        ...selectedWorkflow,
        topicDetail: topicDetail
      };
      onRowClick(enrichedMessage);
    }
  };

  // Back to workflows view
  const handleBackToWorkflows = () => {
    setSelectedWorkflow(null);
    setTopicDetails([]);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 pb-16 pt-4">
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader className="py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                {selectedWorkflow && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToWorkflows}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                <CardTitle>
                  {selectedWorkflow 
                    ? `Topic Details for Workflow: ${selectedWorkflow.workflowId}` 
                    : "Grid Gain Messages"}
                </CardTitle>
              </div>
              
              {!selectedWorkflow && (
                <div className="w-full md:w-auto">
                  <SearchFilterBar
                    onSearchChange={onSearchChange}
                    onTypeFilter={onTypeFilter}
                    onWorkflowSearch={onWorkflowSearch}
                    messageTypes={messageTypes}
                    selectedTypes={selectedTypes}
                  />
                </div>
              )}
            </div>
            <CardDescription>
              {isLoading 
                ? "Loading data from API..." 
                : selectedWorkflow 
                  ? `${topicDetails.length} topic detail(s) found for workflow ${selectedWorkflow.workflowId}`
                  : `${filteredMessages.length} message(s) found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedWorkflow ? (
              <TopicDetailsTable
                topicDetails={paginatedTopics}
                currentPage={topicCurrentPage}
                totalPages={topicTotalPages}
                onRowClick={handleTopicClick}
                onPageChange={setTopicCurrentPage}
              />
            ) : (
              <MessagesTable
                messages={paginatedMessages}
                currentPage={currentPage}
                totalPages={totalPages}
                environmentName={environmentName}
                onRowClick={handleWorkflowClick}
                onPageChange={onPageChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default GridGainContent;
