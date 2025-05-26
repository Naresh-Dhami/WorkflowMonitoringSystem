import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator";
import MessageDetailsGrid from "@/components/shared/MessageDetailsGrid";

interface Message {
  id: string;
  timestamp: Date;
  [key: string]: any;
}

const GridGainContent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [messageType, setMessageType] = useState<string | undefined>(undefined);
  const { toast } = useToast()

  useEffect(() => {
    // Mock data - replace with actual data fetching
    const mockMessages: Message[] = Array.from({ length: 20 }, (_, i) => ({
      id: `message-${i + 1}`,
      timestamp: new Date(Date.now() - i * 100000),
      type: ['Order', 'Trade', 'Quote'][i % 3],
      status: ['New', 'Processed', 'Failed'][i % 3],
      amount: Math.floor(Math.random() * 1000),
      description: `Mock message ${i + 1}`
    }));
    setMessages(mockMessages);
  }, []);

  const filteredMessages = messages.filter(message => {
    const searchRegex = new RegExp(searchQuery, 'i');
    const matchesSearch = Object.values(message).some(value =>
      typeof value === 'string' && searchRegex.test(value)
    );

    const matchesDate = selectedDate
      ? format(message.timestamp, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      : true;

    const matchesType = messageType ? message.type === messageType : true;

    return matchesSearch && matchesDate && matchesType;
  });

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setShowMessageDetails(true);
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">Grid Gain Messages</CardTitle>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) =>
                  date > new Date() || date < new Date('2020-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select onValueChange={setMessageType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Order">Order</SelectItem>
              <SelectItem value="Trade">Trade</SelectItem>
              <SelectItem value="Quote">Quote</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] w-full">
            <div className="divide-y divide-border">
              {filteredMessages.map(message => (
                <div
                  key={message.id}
                  className="p-4 hover:bg-secondary cursor-pointer"
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{message.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">{message.type}</Badge>
                    <Badge>{message.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
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
  );
};

export default GridGainContent;
