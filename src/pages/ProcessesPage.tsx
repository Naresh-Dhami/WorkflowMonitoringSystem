
import React, { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useBatchJobs } from "@/hooks/useBatchJobs";
import { useProcesses } from "@/hooks/useProcesses";
import ProcessSection from "@/components/ProcessSection";
import ActiveJobsSection from "@/components/ActiveJobsSection";
import TestRunsSection from "@/components/TestRunsSection";
import BatchRunnerModal from "@/components/BatchRunnerModal";
import ConfigModal from "@/components/ConfigModal";
import { ProcessConfig } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import DeleteConfirmationDialog from "@/components/navigation/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const ProcessesPage = () => {
  usePageTitle();

  // Use the hooks for processes and batch jobs
  const {
    processes,
    addProcess,
    updateProcess,
    deleteProcess,
    exportProcesses,
    importProcesses
  } = useProcesses();

  const {
    testRuns,
    activeJobs,
    isLoading,
    isRunningBatch,
    batchProgress,
    runProcess,
    runBatch,
  } = useBatchJobs();

  // State for modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [currentProcess, setCurrentProcess] = useState<ProcessConfig | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [processToDelete, setProcessToDelete] = useState<string | null>(null);

  // Creating a new process
  const handleNewProcess = () => {
    setCurrentProcess(null); // Set to null to indicate new process
    setShowConfigModal(true);
  };

  // Editing an existing process
  const handleEditProcess = (process: ProcessConfig) => {
    setCurrentProcess(process);
    setShowConfigModal(true);
  };

  // Run a single process
  const handleRunProcess = (processId: string) => {
    runProcess(processId);
  };

  // Delete a process
  const handleDeleteProcess = (processId: string) => {
    setProcessToDelete(processId);
    setShowDeleteDialog(true);
  };

  // Confirm delete process
  const confirmDeleteProcess = () => {
    if (processToDelete) {
      deleteProcess(processToDelete);
      setProcessToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  // Save a process (add new or update existing)
  const handleSaveProcess = (process: Omit<ProcessConfig, "id">) => {
    if (!currentProcess) {
      // Add a new process with a unique ID
      const newProcess = {
        ...process,
        id: uuidv4(),
      };
      addProcess(newProcess);
    } else {
      // Update an existing process
      updateProcess({
        ...process,
        id: currentProcess.id,
      });
    }
    setShowConfigModal(false);
  };

  // Function to run batch processes
  const handleRunBatch = () => {
    setShowBatchModal(true);
  };

  // Function to manage processes
  const handleManageProcesses = () => {
    setCurrentProcess(null);
    setShowConfigModal(true);
  };

  // Handle import processes
  const handleImportProcesses = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          importProcesses(content);
          toast.success('Processes imported successfully');
        } catch (error) {
          console.error('Failed to import processes:', error);
          toast.error('Failed to import processes');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Handle export processes
  const handleExportProcesses = () => {
    exportProcesses();
    toast.success('Processes exported successfully');
  };

  return (
    <div className="container p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">XVA Processes</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={handleImportProcesses}
            variant="outline"
            className="text-sm"
          >
            Import Processes
          </Button>
          <Button 
            onClick={handleExportProcesses}
            variant="outline"
            className="text-sm"
          >
            Export Processes
          </Button>
          <Button 
            onClick={handleManageProcesses}
            className="btn-animation"
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Processes
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6">
        {/* Processes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProcessSection
            processes={processes}
            testRuns={testRuns}
            activeJobs={activeJobs}
            isLoading={isLoading}
            onNewProcess={handleNewProcess}
            onRunProcess={handleRunProcess}
            onEditProcess={handleEditProcess}
            onDeleteProcess={handleDeleteProcess}
            onRunBatch={handleRunBatch}
          />
        </div>
        
        {/* Active Jobs Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <ActiveJobsSection activeJobs={activeJobs} />
        </div>
        
        {/* Test Runs Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <TestRunsSection testRuns={testRuns} processes={processes} />
        </div>
      </div>
      
      {/* Batch Modal */}
      {showBatchModal && (
        <BatchRunnerModal
          isOpen={showBatchModal}
          onClose={() => setShowBatchModal(false)}
          processes={processes}
          onRunBatch={runBatch}
          isRunning={isRunningBatch}
          batchProgress={batchProgress}
        />
      )}
      
      {/* Config Modal */}
      <ConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        process={currentProcess || undefined}
        onSave={handleSaveProcess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteProcess}
        title="Delete Process"
        description="Are you sure you want to delete this process? This action cannot be undone."
      />
    </div>
  );
};

export default ProcessesPage;
