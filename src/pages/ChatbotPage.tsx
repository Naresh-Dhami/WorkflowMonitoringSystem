
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInterface from "@/components/chatbot/ChatInterface";

const ChatbotPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">AI Chatbot</h1>
          <p className="text-muted-foreground">
            Chat with AI, scrape web content, and get intelligent responses
          </p>
        </div>

        <Card className="h-[700px]">
          <CardHeader>
            <CardTitle>Chat Interface</CardTitle>
          </CardHeader>
          <CardContent className="h-full p-0">
            <ChatInterface />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotPage;
