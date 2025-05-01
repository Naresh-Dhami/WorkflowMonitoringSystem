
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Filter, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MessageDetail } from "@/types";
import { cn } from "@/lib/utils";
import GridGainRecordDialog from "@/components/gridgain/GridGainRecordDialog";
import MessageDetailsDrawer from "@/components/gridgain/MessageDetailsDrawer"; // Import MessageDetailsDrawer
import { GridGainMessage } from "@/components/gridgain/GridGainData";

interface MessageDetailsGridProps {
  topic: string;
  messageType?: string;
  onBack: () => void;
}

const MessageDetailsGrid: React.FC<MessageDetailsGridProps> = ({
  topic,
  messageType = "bflat",
  onBack
}) => {
  const [messages, setMessages] = useState<MessageDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState<MessageDetail[]>([]);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<GridGainMessage | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const itemsPerPage = 10;
  
  useEffect(() => {
    // In a real app, this would be an API call
    const loadMessages = () => {
      setLoading(true);
      
      // Generate sample data based on the example provided
      const sampleData: MessageDetail[] = [
        {
          id: "1",
          typeId: 51,
          typeName: "XVA220809-372_FVA",
          typePfx: "",
          typeRunDate: "20250404",
          startIndex: 1,
          dataSetType: "Header",
          topic: topic,
          messageCount: 71796
        },
        {
          id: "2",
          typeId: 51,
          typeName: "XVA220126-242",
          typePfx: "",
          typeRunDate: "20250404",
          startIndex: 1,
          dataSetType: "Header",
          topic: topic,
          messageCount: 71796
        },
        {
          id: "3",
          typeId: 51,
          typeName: "XVA221007-63",
          typePfx: "",
          typeRunDate: "20250404",
          startIndex: 1,
          dataSetType: "Header",
          topic: topic,
          messageCount: 71796
        },
        {
          id: "4",
          typeId: 51,
          typeName: "XVA221208-25",
          typePfx: "",
          typeRunDate: "20250404",
          startIndex: 0,
          dataSetType: "Matrix",
          topic: topic,
          messageCount: 71796
        },
        {
          id: "5",
          typeId: 51,
          typeName: "XVA220101-62_FVA",
          typePfx: "",
          typeRunDate: "20250404",
          startIndex: 0,
          dataSetType: "Header",
          topic: topic,
          messageCount: 71796
        },
        {
          id: "6",
          typeId: 51,
          typeName: "XVA221208-95_FVA",
          typePfx: "",
          typeRunDate: "20250404",
          startIndex: 1,
          dataSetType: "Matrix",
          topic: topic,
          messageCount: 71796
        },
        {
          id: "7",
          typeId: 51,
          typeName: "XVA171209-361_FVA",
          typePfx: "",
          typeRunDate: "20250404",
          startIndex: 0,
          dataSetType: "Matrix",
          topic: topic,
          messageCount: 71796
        },
        {
          id: "8",
          typeId: 51,
          typeName: "XVA240629-11",
          typePfx: "",
          typeRunDate: "20250404",
          startIndex: 1,
          dataSetType: "Header",
          topic: topic,
          messageCount: 71796
        },
        {
          id: "9",
          typeId: 51,
          typeName: "XVA220815-392_FVA",
          typePfx: "Base_XA_Rates_CLYP12",
          typeRunDate: "20250404",
          startIndex: 1,
          dataSetType: "Header",
          topic: topic,
          messageCount: 71796
        },
        {
          id: "10",
          typeId: 51,
          typeName: "XVA220815-392_FVA",
          typePfx: "Base_XA_Rates_CLYP12",
          typeRunDate: "20250404",
          startIndex: 0,
          dataSetType: "Matrix",
          topic: topic,
          messageCount: 71796
        }
      ];
      
      setMessages(sampleData);
      setFilteredMessages(sampleData);
      setLoading(false);
    };
    
    loadMessages();
  }, [topic]);
  
  // Filter messages based on search term and type filter
  useEffect(() => {
    let filtered = [...messages];
    
    if (searchTerm) {
      filtered = filtered.filter(message => 
        message.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.typePfx.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.dataSetType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (typeFilter) {
      filtered = filtered.filter(message => message.dataSetType === typeFilter);
    }
    
    setFilteredMessages(filtered);
    setCurrentPage(1);
  }, [messages, searchTerm, typeFilter]);
  
  // Get current page items
  const indexOfLastMessage = currentPage * itemsPerPage;
  const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter(null);
  };
  
  const handleShowDetails = (message: MessageDetail) => {
    // Convert MessageDetail to GridGainMessage for the drawer
    const gridGainMessage: GridGainMessage = {
      id: message.id,
      workflowId: message.typeName,
      type: message.dataSetType,
      status: "Completed",
      timestamp: new Date().getTime(),
      details: JSON.stringify({
        typeId: message.typeId,
        typeName: message.typeName,
        typePfx: message.typePfx,
        typeRunDate: message.typeRunDate,
        startIndex: message.startIndex,
        dataSetType: message.dataSetType,
        topic: message.topic,
        messageCount: message.messageCount
      }, null, 2)
    };
    
    setSelectedMessage(gridGainMessage);
    setIsDrawerOpen(true);
  };

  // Handle adding new record
  const handleAddRecord = () => {
    setIsDialogOpen(true);
  };
  
  return (
    <Card className="mt-4">
      <CardHeader className="py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <CardTitle>Topic: {topic}</CardTitle>
          </div>
          
          <Button onClick={handleAddRecord} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
        <CardDescription>
          Message Type: {messageType} | Total Message Count: {messages.length} | 
          {filteredMessages.length < messages.length 
            ? `Showing ${filteredMessages.length} out of ${messages.length}`
            : `Showing ${itemsPerPage > filteredMessages.length ? filteredMessages.length : itemsPerPage} out of ${messages.length}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 w-1/2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    {typeFilter ? `Type: ${typeFilter}` : "Filter"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[150] bg-white">
                  <DropdownMenuItem onClick={() => setTypeFilter("Header")} className="cursor-pointer">
                    Header
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter("Matrix")} className="cursor-pointer">
                    Matrix
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clearFilters} className="cursor-pointer text-red-500">
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {filteredMessages.length} messages
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Loading message details...
                    </TableCell>
                  </TableRow>
                ) : currentMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No messages found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.id}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          [typeId={message.typeId}, typeName={message.typeName}, 
                          typePfx={message.typePfx}, typeRunDate={message.typeRunDate}, 
                          startIndex={message.startIndex}, dataSetType={message.dataSetType}]
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleShowDetails(message)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Add Record Dialog */}
      <GridGainRecordDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        topic={topic}
      />

      {/* Message Details Drawer */}
      <MessageDetailsDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        message={selectedMessage}
        environmentName="Default"
      />
    </Card>
  );
};

export default MessageDetailsGrid;
