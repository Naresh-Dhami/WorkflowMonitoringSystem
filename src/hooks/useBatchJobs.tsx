
import { useState } from "react";
import { useTestRuns } from "./useTestRuns";
import { useActiveJobs } from "./useActiveJobs";
import { useJobRunner } from "./useJobRunner";
import { useBatchRunner } from "./useBatchRunner";
import { BatchJob, ProcessConfig } from "@/types";

export function useBatchJobs() {
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the extracted hooks
  const { testRuns, addTestRun } = useTestRuns();
  const { activeJobs, addJob, updateJob } = useActiveJobs();
  
  // Use the job runner
  const { runProcess: runProcessBase } = useJobRunner(
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
    testRuns,
    activeJobs,
    isLoading,
    isRunningBatch,
    batchProgress,
    batchResults,
    runProcess,
    runBatch
  };
}
