
import React, { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useBatchJobs } from "@/hooks/useBatchJobs";
import ProcessSection from "@/components/ProcessSection";
import ActiveJobsSection from "@/components/ActiveJobsSection";
import TestRunsSection from "@/components/TestRunsSection";
import BatchRunnerModal from "@/components/BatchRunnerModal";
import ConfigModal from "@/components/ConfigModal";
import { ProcessConfig } from "@/types";
import { v4 as uuidv4 } from "uuid";

const ProcessesPage = () => {
  usePageTitle();

  const {
    processes,
    testRuns,
    activeJobs,
    isLoading,
    isRunningBatch,
    batchProgress,
    addProcess,
    updateProcess,
    deleteProcess,
    runProcess,
    runBatch,
  } = useBatchJobs();

  // State for modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [currentProcess, setCurrentProcess] = useState<ProcessConfig | null>(null);

  // Creating a new process
  const handleNewProcess = () => {
    setCurrentProcess(null);
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
    deleteProcess(processId);
  };

  // Save a process (add new or update existing)
  const handleSaveProcess = (process: Omit<ProcessConfig, "id">) => {
    if (!currentProcess) {
      // Add a new process
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

  return (
    <div className="container p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">XVA Processes</h2>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <ProcessSection
          processes={processes}
          testRuns={testRuns}
          activeJobs={activeJobs}
          isLoading={isLoading}
          onNewProcess={handleNewProcess}
          onRunProcess={handleRunProcess}
          onEditProcess={handleEditProcess}
          onDeleteProcess={handleDeleteProcess}
        />
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <ActiveJobsSection activeJobs={activeJobs} />
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <TestRunsSection testRuns={testRuns} processes={processes} />
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
      {showConfigModal && (
        <ConfigModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          process={currentProcess || undefined}
          onSave={handleSaveProcess}
        />
      )}
    </div>
  );
};

export default ProcessesPage;
