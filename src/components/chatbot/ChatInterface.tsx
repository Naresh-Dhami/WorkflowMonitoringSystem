
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Send, Globe, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { scrapeWebContent } from "@/utils/scraper";
import { sendToLLM } from "@/utils/llmService";

interface ChatMessage {
  id: string;
  type: "user" | "bot" | "system";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "system",
      content: "Welcome! I can help you chat and scrape web content. You can either ask me questions directly or provide a URL to scrape content from.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [urlToScrape, setUrlToScrape] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  };

  const handleScrapeAndChat = async () => {
    if (!urlToScrape.trim()) {
      toast.error("Please enter a URL to scrape");
      return;
    }

    setIsLoading(true);
    
    // Add user message about scraping
    const userMsgId = addMessage({
      type: "user",
      content: `Scraping content from: ${urlToScrape}`
    });

    // Add loading bot message
    const botMsgId = addMessage({
      type: "bot",
      content: "Scraping website content...",
      isLoading: true
    });

    try {
      // Scrape the website
      const scrapedContent = await scrapeWebContent(urlToScrape);
      
      // Update the bot message with scraped content
      updateMessage(botMsgId, {
        content: `Successfully scraped content from ${urlToScrape}:\n\n${scrapedContent.slice(0, 500)}${scrapedContent.length > 500 ? '...' : ''}`,
        isLoading: false
      });

      // Now send to LLM if there's a question
      if (inputMessage.trim()) {
        const llmMsgId = addMessage({
          type: "bot",
          content: "Processing with AI...",
          isLoading: true
        });

        const prompt = `Based on the following scraped content:\n\n${scrapedContent}\n\nUser question: ${inputMessage}`;
        const llmResponse = await sendToLLM(prompt);

        updateMessage(llmMsgId, {
          content: llmResponse,
          isLoading: false
        });
      }

      setInputMessage("");
      setUrlToScrape("");
    } catch (error) {
      updateMessage(botMsgId, {
        content: `Error scraping website: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isLoading: false
      });
      toast.error("Failed to scrape website content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);

    // Add user message
    addMessage({
      type: "user",
      content: inputMessage
    });

    // Add loading bot message
    const botMsgId = addMessage({
      type: "bot",
      content: "Thinking...",
      isLoading: true
    });

    try {
      const response = await sendToLLM(inputMessage);
      
      updateMessage(botMsgId, {
        content: response,
        isLoading: false
      });

      setInputMessage("");
    } catch (error) {
      updateMessage(botMsgId, {
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get AI response'}`,
        isLoading: false
      });
      toast.error("Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card className={`max-w-[80%] ${
                message.type === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : message.type === "system"
                  ? "bg-muted"
                  : "bg-card"
              }`}>
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    {message.type === "user" ? (
                      <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    ) : message.type === "bot" ? (
                      message.isLoading ? (
                        <Loader2 className="h-4 w-4 mt-1 flex-shrink-0 animate-spin" />
                      ) : (
                        <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                      )
                    ) : (
                      <Globe className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Input Area */}
      <div className="p-4 space-y-4">
        {/* URL Scraping Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Scrape Website (Optional)</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter URL to scrape (e.g., https://example.com)"
              value={urlToScrape}
              onChange={(e) => setUrlToScrape(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleScrapeAndChat)}
              disabled={isLoading}
            />
            <Button
              onClick={handleScrapeAndChat}
              disabled={isLoading || !urlToScrape.trim()}
              size="sm"
            >
              <Globe className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Message Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Message</label>
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
              disabled={isLoading}
              className="min-h-[60px] resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
