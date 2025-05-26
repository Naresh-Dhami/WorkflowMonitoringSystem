
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface MessageDetailsGridProps {
  message: any;
  onClose: () => void;
}

const MessageDetailsGrid: React.FC<MessageDetailsGridProps> = ({ message, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract all key-value pairs from the message object
  const getMessageDetails = () => {
    const details: { key: string; value: any }[] = [];
    
    const processObject = (obj: any, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          processObject(value, fullKey);
        } else {
          details.push({
            key: fullKey,
            value: value
          });
        }
      });
    };
    
    processObject(message);
    return details;
  };

  const details = getMessageDetails();
  const totalPages = Math.ceil(details.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDetails = details.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) {
      return <Badge variant="secondary">null</Badge>;
    }
    
    if (typeof value === 'boolean') {
      return <Badge variant={value ? "default" : "destructive"}>{String(value)}</Badge>;
    }
    
    if (typeof value === 'number') {
      return <Badge variant="outline">{value.toString()}</Badge>;
    }
    
    if (Array.isArray(value)) {
      return <Badge variant="secondary">[{value.length} items]</Badge>;
    }
    
    if (typeof value === 'string') {
      // Check if it's a URL
      try {
        new URL(value);
        return (
          <div className="flex items-center gap-2">
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer" 
                  onClick={() => window.open(value, '_blank')}>
              {value}
            </span>
            <ExternalLink className="h-3 w-3 text-blue-600" />
          </div>
        );
      } catch {
        // Not a URL, return as regular string
        return <span className="break-all">{value}</span>;
      }
    }
    
    return <span>{JSON.stringify(value)}</span>;
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl">Message Details</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Showing {details.length} properties
        </div>
        
        <Separator />
        
        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-3">
            {currentDetails.map((detail, index) => (
              <div key={`${detail.key}-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg">
                <div className="font-medium text-sm break-all">
                  {detail.key}
                </div>
                <div className="md:col-span-2">
                  {formatValue(detail.value)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {totalPages > 1 && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Page {currentPage.toString()} of {totalPages.toString()}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageDetailsGrid;
