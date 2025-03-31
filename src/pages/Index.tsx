
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProcesses } from "@/hooks/useProcesses";
import { useTestRuns } from "@/hooks/useTestRuns";
import { useActiveJobs } from "@/hooks/useActiveJobs";
import BatchCard from "@/components/BatchCard";
import ProcessSection from "@/components/ProcessSection";
import ActiveJobsSection from "@/components/ActiveJobsSection";
import TestRunsSection from "@/components/TestRunsSection";
import StatusBadge from "@/components/StatusBadge";
import BatchFilter from "@/components/BatchFilter";
import { toast } from "sonner";
import { useBatchJobs } from "@/hooks/useBatchJobs";
import ConfigModal from "@/components/ConfigModal";
import { ProcessConfig } from "@/types";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [currentProcess, setCurrentProcess] = useState<ProcessConfig | undefined>(undefined);
  
  // Use the batch jobs hook which provides all the necessary functions
  const { 
    processes, 
    testRuns, 
    activeJobs, 
    isLoading, 
    runProcess, 
    runBatch,
    addProcess,
    updateProcess,
    deleteProcess
  } = useBatchJobs();

  // Check URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('newProcess') === 'true') {
      handleNewProcess();
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Listen for the custom event from Header
    const handleCustomEvent = () => handleNewProcess();
    window.addEventListener('open-process-modal', handleCustomEvent);

    return () => {
      window.removeEventListener('open-process-modal', handleCustomEvent);
    };
  }, []);

  const availableStatuses = ["Completed", "Running", "Failed", "Pending"];

  // Filter batch jobs based on search and status
  const filteredBatchJobs = activeJobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(job.status);
    return matchesSearch && matchesStatus;
  });

  // Function to handle opening the new process modal
  const handleNewProcess = () => {
    setCurrentProcess(undefined);
    setIsConfigModalOpen(true);
  };

  // Function to handle editing a process
  const handleEditProcess = (process: ProcessConfig) => {
    setCurrentProcess(process);
    setIsConfigModalOpen(true);
  };

  // Function to save process (create or update)
  const handleSaveProcess = (process: ProcessConfig) => {
    if (processes.some(p => p.id === process.id)) {
      updateProcess(process);
    } else {
      addProcess(process);
    }
  };

  const handleImportConfig = () => {
    toast.info("Import Config functionality would go here");
  };

  const handleExportConfig = () => {
    toast.info("Export Config functionality would go here");
  };

  return (
    <>
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
              <ProcessSection 
                processes={processes}
                testRuns={testRuns}
                activeJobs={activeJobs}
                isLoading={isLoading}
                onNewProcess={handleNewProcess}
                onRunProcess={runProcess}
                onEditProcess={handleEditProcess}
                onDeleteProcess={deleteProcess}
              />
            </TabsContent>

            <TabsContent value="batch-jobs" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredBatchJobs.length > 0 ? (
                  filteredBatchJobs.map((job) => (
                    <BatchCard 
                      key={job.id} 
                      process={{
                        id: job.id,
                        name: job.name,
                        description: job.description || "",
                        steps: []
                      }}
                      activeJob={job}
                      onRunClick={() => {}}
                      onEditClick={() => {}}
                      onDeleteClick={() => {}}
                      isLoading={isLoading}
                    />
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
              <TestRunsSection testRuns={testRuns} processes={processes} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        process={currentProcess}
        onSave={handleSaveProcess}
      />
    </>
  );
};

export default Index;
