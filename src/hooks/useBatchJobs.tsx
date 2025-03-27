
import { useState } from "react";
import { useProcesses } from "./useProcesses";
import { useTestRuns } from "./useTestRuns";
import { useActiveJobs } from "./useActiveJobs";
import { useJobRunner } from "./useJobRunner";
import { defaultProcesses } from "@/utils/api";

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
  
  // Wrap runProcess to handle loading state
  const runProcess = async (processId: string) => {
    setIsLoading(true);
    try {
      await runProcessBase(processId);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    processes,
    testRuns,
    activeJobs,
    isLoading,
    addProcess,
    updateProcess,
    deleteProcess,
    runProcess
  };
}
