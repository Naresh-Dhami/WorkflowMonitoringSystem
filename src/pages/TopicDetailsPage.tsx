import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal, ArrowLeft, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import MessageDetailsGrid from "@/components/shared/MessageDetailsGrid";

interface TopicMessage {
  id: string;
  timestamp: string;
  message: any;
}

const TopicDetailsPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { toast } = useToast();
  const { currentEnvironment } = useEnvironment();
  const [messages, setMessages] = useState<TopicMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showMessageDetails, setShowMessageDetails] = useState(false);

  useEffect(() => {
    if (topicId) {
      fetchMessages();
    }
  }, [topicId, currentEnvironment]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${currentEnvironment.url}/api/topics/${topicId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Could not fetch messages:", error);
      toast({
        title: "Error fetching messages",
        description: "Failed to load messages. Please check the server and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = (message: any) => {
    setSelectedMessage(message);
    setShowMessageDetails(true);
  };

  const copyMessage = (message: any) => {
    navigator.clipboard.writeText(JSON.stringify(message, null, 2));
    toast({
      title: "Message copied",
      description: "The message has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link to="/grid-gain-viewer" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Topics
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Topic: {topicId}</h1>
          <p className="text-muted-foreground">
            View messages for the selected topic.
          </p>
        </div>

        <Card className="h-[700px]">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Messages</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchMessages}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Badge variant="secondary">{messages.length} messages</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-full p-0">
            <ScrollArea className="h-[600px] w-full">
              {loading ? (
                <div className="p-4">Loading messages...</div>
              ) : (
                <div className="p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="border rounded-md p-3 hover:bg-secondary cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium break-all" onClick={() => handleMessageClick(msg.message)}>
                          Message ID: {msg.id}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyMessage(msg.message)}>
                              <Copy className="h-3 w-3 mr-2" />
                              Copy Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Timestamp: {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        
        {showMessageDetails && selectedMessage && (
          <MessageDetailsGrid 
            message={selectedMessage} 
            onClose={() => setShowMessageDetails(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default TopicDetailsPage;
