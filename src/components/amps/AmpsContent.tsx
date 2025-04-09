
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchFilterBar from "@/components/amps/SearchFilterBar";
import MessagesTable from "@/components/amps/MessagesTable";
import TopicDetailsTable, { TopicDetail } from "@/components/amps/TopicDetailsTable";
import { AmpsMessage } from "./ampsData";

interface AmpsContentProps {
  isLoading: boolean;
  filteredMessages: AmpsMessage[];
  paginatedMessages: AmpsMessage[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTypes: string[];
  onTypeFilter: (types: string[]) => void;
  currentPage: number;
  totalPages: number;
  environmentName: string;
  onRowClick: (message: AmpsMessage) => void;
  onPageChange: (page: number) => void;
  onWorkflowSearch: (workflowId: string) => Promise<void>;
  messageTypes: string[];
  ampsUrl?: string;
}

const AmpsContent: React.FC<AmpsContentProps> = ({
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
  messageTypes,
  ampsUrl
}) => {
  const navigate = useNavigate();
  const [selectedWorkflow, setSelectedWorkflow] = useState<AmpsMessage | null>(null);
  const [topicDetails, setTopicDetails] = useState<TopicDetail[]>([]);
  const [topicCurrentPage, setTopicCurrentPage] = useState(1);
  
  // Calculate total pages for topic details
  const topicItemsPerPage = 10;
  const topicTotalPages = Math.ceil(topicDetails.length / topicItemsPerPage);
  const topicStartIndex = (topicCurrentPage - 1) * topicItemsPerPage;
  const paginatedTopics = topicDetails.slice(topicStartIndex, topicStartIndex + topicItemsPerPage);

  // Handle workflow row click
  const handleWorkflowClick = (message: AmpsMessage) => {
    setSelectedWorkflow(message);
    
    // Generate sample topic details based on the selected workflow
    // In a real app, you would fetch these from an API
    const generatedTopics: TopicDetail[] = Array.from({ length: 15 }, (_, i) => ({
      id: `topic-${message.id}-${i}`,
      topic: `AMPS.${message.type}.Topic.${i + 1}`,
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
    if (selectedWorkflow) {
      // Navigate to the topic details page when a topic is clicked
      navigate(`/amps-topic/${topicDetail.id}`);
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
                    ? `AMPS Topic Details for Workflow: ${selectedWorkflow.workflowId}` 
                    : "AMPS Messages"}
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

export default AmpsContent;
