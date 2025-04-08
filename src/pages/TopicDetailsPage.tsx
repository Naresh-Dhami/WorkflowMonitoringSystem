
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { TopicDetail } from "@/types";
import { Sheet } from "@/components/ui/sheet";
import TopicDetailsTable from "@/components/amps/TopicDetailsTable";
import { useToast } from "@/components/ui/use-toast";
import MessageDetailsGrid from "@/components/shared/MessageDetailsGrid";

// Sample data for demonstrating the component
const sampleTopicDetails: TopicDetail[] = [
  {
    id: "1",
    topic: "transaction.events",
    partition: 0,
    offset: 1000,
    status: "Completed",
    timestamp: new Date().toISOString(),
    message: "Transaction processed successfully"
  },
  {
    id: "2",
    topic: "transaction.events",
    partition: 1,
    offset: 1001,
    status: "Failed",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    message: "Error: Invalid transaction format"
  },
  {
    id: "3",
    topic: "user.events",
    partition: 0,
    offset: 500,
    status: "Running",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    message: "Processing user data"
  },
  {
    id: "4",
    topic: "system.events",
    partition: 2,
    offset: 2500,
    status: "Pending",
    timestamp: new Date(Date.now() - 180000).toISOString(),
    message: "Waiting for dependencies"
  },
];

const TopicDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentEnvironment } = useEnvironment();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<TopicDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const { toast } = useToast();

  // In a real app, fetch topic details based on the ID
  // For now, use sample data
  const topicDetails = sampleTopicDetails;
  const totalPages = Math.ceil(topicDetails.length / 10);

  const handleTopicDetailClick = (topicDetail: TopicDetail) => {
    setSelectedTopicDetail(topicDetail);
    setShowMessageDetails(true);
    toast({
      title: "Topic Detail Selected",
      description: `Selected topic: ${topicDetail.topic}, Partition: ${topicDetail.partition}`,
    });
  };
  
  const handleBackToTopics = () => {
    setShowMessageDetails(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/amps-viewer">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Topic Details</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Environment: {currentEnvironment.name}
        </div>
      </div>

      {showMessageDetails && selectedTopicDetail ? (
        <MessageDetailsGrid 
          topic={selectedTopicDetail.topic} 
          onBack={handleBackToTopics}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Topic: {id}</CardTitle>
          </CardHeader>
          <CardContent>
            <TopicDetailsTable 
              topicDetails={topicDetails}
              currentPage={currentPage}
              totalPages={totalPages}
              onRowClick={handleTopicDetailClick}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      )}

      {selectedTopicDetail && (
        <Sheet
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        >
          <div className="fixed inset-0 z-50 flex items-start justify-end">
            <div className="h-full w-3/4 max-w-md bg-background p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Topic Detail</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsDrawerOpen(false)}>
                  Close
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Topic</h3>
                  <p className="text-base">{selectedTopicDetail.topic}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Partition</h3>
                  <p className="text-base">{selectedTopicDetail.partition}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Offset</h3>
                  <p className="text-base">{selectedTopicDetail.offset}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-base">{selectedTopicDetail.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Timestamp</h3>
                  <p className="text-base">{new Date(selectedTopicDetail.timestamp).toLocaleString()}</p>
                </div>
                {selectedTopicDetail.message && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                    <pre className="text-sm bg-muted p-2 rounded mt-1 overflow-auto">
                      {selectedTopicDetail.message}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Sheet>
      )}
    </div>
  );
};

export default TopicDetailsPage;
