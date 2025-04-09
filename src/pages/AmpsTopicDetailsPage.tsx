
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import MessageDetailsGrid from "@/components/shared/MessageDetailsGrid";
import AmpsHeader from "@/components/amps/AmpsHeader";
import MessageDetailsDrawer from "@/components/amps/MessageDetailsDrawer";
import { toast } from "sonner";

interface AmpsTopicDetail {
  id: string;
  topic: string;
  messageType: string;
  messageCount: number;
}

const AmpsTopicDetailsPage = () => {
  const { currentEnvironment } = useEnvironment();
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [topicDetail, setTopicDetail] = useState<AmpsTopicDetail | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  useEffect(() => {
    const loadTopicDetails = async () => {
      setIsLoading(true);
      try {
        // In a real app, you'd fetch the topic details from an API
        // For now, we'll simulate with a timeout and fake data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample data for demo
        const fakeTopic: AmpsTopicDetail = {
          id: topicId || "unknown",
          topic: `AMPS.Topic.${topicId}`,
          messageType: "bflat",
          messageCount: 71796
        };
        
        setTopicDetail(fakeTopic);
        toast.success(`Topic details loaded: ${fakeTopic.topic}`);
      } catch (error) {
        console.error("Error loading topic details:", error);
        toast.error("Failed to load topic details");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (topicId) {
      loadTopicDetails();
    }
  }, [topicId]);
  
  const handleBack = () => {
    navigate("/amps-viewer");
  };
  
  const handleShowMessageDetails = (message: any) => {
    setSelectedMessage(message);
    setIsDrawerOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AmpsHeader 
          environmentName={currentEnvironment.name}
          ampsUrl={currentEnvironment.ampsUrl}
        />
        <main className="max-w-6xl mx-auto px-6 pb-16 pt-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Loading topic details...</div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!topicDetail) {
    return (
      <div className="min-h-screen bg-background">
        <AmpsHeader 
          environmentName={currentEnvironment.name}
          ampsUrl={currentEnvironment.ampsUrl}
        />
        <main className="max-w-6xl mx-auto px-6 pb-16 pt-4">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-lg font-medium mb-2">Topic not found</div>
            <div className="text-muted-foreground mb-4">The requested topic could not be found.</div>
            <button 
              onClick={handleBack}
              className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
            >
              Back to AMPS Viewer
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <AmpsHeader 
        environmentName={currentEnvironment.name}
        ampsUrl={currentEnvironment.ampsUrl}
      />
      <main className="max-w-6xl mx-auto px-6 pb-16 pt-4">
        <MessageDetailsGrid
          topic={topicDetail.topic}
          messageType={topicDetail.messageType}
          onBack={handleBack}
        />
      </main>
      
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

export default AmpsTopicDetailsPage;
