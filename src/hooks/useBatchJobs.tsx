
import { useState } from "react";
import { useProcesses } from "./useProcesses";
import { useTestRuns } from "./useTestRuns";
import { useActiveJobs } from "./useActiveJobs";
import { useJobRunner } from "./useJobRunner";
import { useBatchRunner } from "./useBatchRunner";
import { defaultProcesses } from "@/utils/api";
import { BatchJob, ProcessConfig } from "@/types";

export function useBatchJobs() {
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the extracted hooks
  const { processes, addProcess, updateProcess, deleteProcess } = useProcesses();
  const { testRuns, addTestRun } = useTestRuns();
  const { activeJobs, addJob, updateJob } = useActiveJobs();
  
  // Create initial processes if none exist
  if (processes.length === 0) {
    // Add default processes
    defaultProcesses.forEach(process => {
      addProcess(process);
    });
  }
  
  // Use the job runner
  const { runProcess: runProcessBase } = useJobRunner(
    processes,
    addTestRun,
    addJob,
    updateJob
  );
  
  // Use the batch runner
  const { 
    runMultipleProcesses,
    isRunningBatch,
    batchProgress,
    batchResults
  } = useBatchRunner(
    processes,
    addTestRun,
    addJob,
    updateJob
  );
  
  // Wrap runProcess to handle loading state
  const runProcess = async (processId: string) => {
    setIsLoading(true);
    try {
      await runProcessBase(processId);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Wrap runMultipleProcesses to handle loading state
  const runBatch = async (processIds: string[], emailReport?: string) => {
    setIsLoading(true);
    try {
      return await runMultipleProcesses(processIds, emailReport);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    processes,
    testRuns,
    activeJobs,
    isLoading,
    isRunningBatch,
    batchProgress,
    batchResults,
    addProcess,
    updateProcess,
    deleteProcess,
    runProcess,
    runBatch
  };
}
