
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBatchRunner } from "@/hooks/useBatchRunner";
import { useProcesses } from "@/hooks/useProcesses";
import { useBatchJobs } from "@/hooks/useBatchJobs";
import { useActiveJobs } from "@/hooks/useActiveJobs";
import { useTestRuns } from "@/hooks/useTestRuns";
import BatchCard from "@/components/BatchCard";
import ProcessSection from "@/components/ProcessSection";
import ActiveJobsSection from "@/components/ActiveJobsSection";
import TestRunsSection from "@/components/TestRunsSection";
import StatusBadge from "@/components/StatusBadge";
import BatchFilter from "@/components/BatchFilter";
import { toast } from "sonner";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const { openBatchRunnerModal } = useBatchRunner();
  const { processes, importConfig, exportConfig } = useProcesses();
  const { batchJobs } = useBatchJobs();
  const { activeJobs } = useActiveJobs();
  const { testRuns } = useTestRuns();

  const availableStatuses = ["Completed", "Running", "Failed", "Pending"];

  // Filter batch jobs based on search and status
  const filteredBatchJobs = batchJobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(job.status);
    return matchesSearch && matchesStatus;
  });

  const handleImportConfig = () => {
    importConfig();
  };

  const handleExportConfig = () => {
    exportConfig();
  };

  return (
    <>
      <Header 
        onNewProcess={openBatchRunnerModal}
        onImportConfig={handleImportConfig}
        onExportConfig={handleExportConfig}
      />

      <main className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <Tabs defaultValue="processes" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <TabsList>
                <TabsTrigger value="processes">Processes</TabsTrigger>
                <TabsTrigger value="batch-jobs">Batch Jobs</TabsTrigger>
                <TabsTrigger value="active-jobs">Active Jobs</TabsTrigger>
                <TabsTrigger value="test-runs">Test Runs</TabsTrigger>
              </TabsList>
              
              <div className="mt-4 sm:mt-0 w-full sm:w-auto max-w-md">
                <BatchFilter 
                  onSearchChange={setSearchTerm}
                  onStatusFilter={setSelectedStatuses}
                  statuses={availableStatuses}
                  selectedStatuses={selectedStatuses}
                />
              </div>
            </div>

            <TabsContent value="processes" className="mt-0">
              <ProcessSection processes={processes} />
            </TabsContent>

            <TabsContent value="batch-jobs" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredBatchJobs.length > 0 ? (
                  filteredBatchJobs.map((job) => (
                    <BatchCard key={job.id} batchJob={job} />
                  ))
                ) : (
                  <div className="md:col-span-2 lg:col-span-3 p-8 text-center">
                    <p className="text-muted-foreground">
                      {searchTerm || selectedStatuses.length > 0 
                        ? "No batch jobs match your search criteria" 
                        : "No batch jobs available"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="active-jobs" className="mt-0">
              <ActiveJobsSection activeJobs={activeJobs} />
            </TabsContent>

            <TabsContent value="test-runs" className="mt-0">
              <TestRunsSection testRuns={testRuns} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default Index;
