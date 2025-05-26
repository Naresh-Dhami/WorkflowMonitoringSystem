import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MoreVertical, Edit, Copy, ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import MessageDetailsGrid from "@/components/shared/MessageDetailsGrid";

interface Message {
  id: string;
  topic: string;
  payload: any;
  timestamp: string;
}

const AmpsTopicDetailsPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { toast } = useToast();
  const { currentEnvironment } = useEnvironment();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filterText, setFilterText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageDetails, setShowMessageDetails] = useState(false);

  useEffect(() => {
    if (topicId && currentEnvironment.name) {
      fetchMessages(topicId, currentEnvironment.name);
    }
  }, [topicId, currentEnvironment.name]);

  const fetchMessages = async (topicId: string, environmentName: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/amps/messages?topic=${topicId}&environment=${environmentName}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Could not fetch messages:", error);
      toast({
        title: "Error",
        description: `Could not fetch messages for topic ${topicId}: ${error}`,
        variant: "destructive",
      });
    }
  };

  const copyMessage = (message: any) => {
    navigator.clipboard
      .writeText(JSON.stringify(message, null, 2))
      .then(() => {
        toast({
          title: "Copied!",
          description: "Message copied to clipboard.",
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to copy message to clipboard.",
          variant: "destructive",
        });
        console.error("Failed to copy message: ", err);
      });
  };

  const filteredMessages = messages.filter((message) => {
    const searchTerm = filterText.toLowerCase();
    return (
      JSON.stringify(message.payload).toLowerCase().includes(searchTerm) ||
      message.topic.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link to="/amps-viewer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to AMPS Viewer
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            AMPS Topic: {topicId}
          </h1>
          <p className="text-muted-foreground">
            View messages for topic <Badge>{topicId}</Badge> in environment{" "}
            <Badge>{currentEnvironment.name}</Badge>
          </p>
        </div>

        <Card className="h-[700px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">Messages</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Filter messages..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <Separator />
            <ScrollArea className="h-[500px] mt-4">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="border rounded-md p-4 mb-2 hover:bg-secondary cursor-pointer"
                  onClick={() => {
                    setSelectedMessage(message);
                    setShowMessageDetails(true);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{message.topic}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            copyMessage(message.payload);
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit{" "}
                          <span className="ml-auto">Ctrl+E</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Timestamp: {message.timestamp}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Message ID: {message.id}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {showMessageDetails && selectedMessage && (
        <MessageDetailsGrid 
          message={selectedMessage} 
          onClose={() => setShowMessageDetails(false)} 
        />
      )}
    </div>
  );
};

export default AmpsTopicDetailsPage;
