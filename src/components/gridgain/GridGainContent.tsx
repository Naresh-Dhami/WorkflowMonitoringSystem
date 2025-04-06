
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SearchFilterBar from "@/components/gridgain/SearchFilterBar";
import MessagesTable from "@/components/gridgain/MessagesTable";
import { GridGainMessage } from "@/components/gridgain/GridGainData";

interface GridGainContentProps {
  isLoading: boolean;
  filteredMessages: GridGainMessage[];
  paginatedMessages: GridGainMessage[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTypes: string[];
  onTypeFilter: (types: string[]) => void;
  currentPage: number;
  totalPages: number;
  environmentName: string;
  onRowClick: (message: GridGainMessage) => void;
  onPageChange: (page: number) => void;
  onWorkflowSearch: (workflowId: string) => Promise<void>;
  messageTypes: string[];
}

const GridGainContent: React.FC<GridGainContentProps> = ({
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
  messageTypes
}) => {
  return (
    <main className="max-w-6xl mx-auto px-6 pb-16 pt-4">
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader className="py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Grid Gain Messages</CardTitle>
              <div className="w-full md:w-auto">
                <SearchFilterBar
                  onSearchChange={onSearchChange}
                  onTypeFilter={onTypeFilter}
                  onWorkflowSearch={onWorkflowSearch}
                  messageTypes={messageTypes}
                  selectedTypes={selectedTypes}
                />
              </div>
            </div>
            <CardDescription>
              {isLoading ? "Loading data from API..." : `${filteredMessages.length} message(s) found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MessagesTable
              messages={paginatedMessages}
              currentPage={currentPage}
              totalPages={totalPages}
              environmentName={environmentName}
              onRowClick={onRowClick}
              onPageChange={onPageChange}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default GridGainContent;
