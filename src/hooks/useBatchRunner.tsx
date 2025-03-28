
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ProcessConfig, BatchJob, TestRun } from "@/types";
import { useJobRunner } from "./useJobRunner";
import { useTestRuns } from "./useTestRuns";
import { useActiveJobs } from "./useActiveJobs";
import { sendBatchReport } from "@/utils/reportService";
import { useEnvironment } from "@/contexts/EnvironmentContext";

export function useBatchRunner(
  processes: ProcessConfig[],
  addTestRun: (testRun: TestRun) => void,
  addJob: (job: BatchJob) => void,
  updateJob: (jobId: string, updates: Partial<BatchJob>) => void
) {
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchResults, setBatchResults] = useState<{
    total: number;
    completed: number;
    failed: number;
    processIds: string[];
  }>({ total: 0, completed: 0, failed: 0, processIds: [] });
  
  const { currentEnvironment } = useEnvironment();

  // Use the job runner
  const { runProcess } = useJobRunner(processes, addTestRun, addJob, updateJob);

  // Run multiple processes in sequence
  const runMultipleProcesses = useCallback(async (
    processIds: string[], 
    emailReport?: string
  ) => {
    if (isRunningBatch) {
      toast.warning("A batch operation is already in progress");
      return;
    }

    if (processIds.length === 0) {
      toast.warning("No processes selected to run");
      return;
    }

    if (processIds.length > 20) {
      toast.warning("Maximum of 20 processes can be run in a batch");
      return;
    }

    // Initialize batch state
    setIsRunningBatch(true);
    setBatchProgress(0);
    setBatchResults({
      total: processIds.length,
      completed: 0,
      failed: 0,
      processIds: [...processIds]
    });

    toast.info(`Starting batch run of ${processIds.length} processes in ${currentEnvironment.name} environment`);

    const results = [];
    let completed = 0;
    let failed = 0;

    // Run processes one by one
    for (let i = 0; i < processIds.length; i++) {
      const processId = processIds[i];
      const process = processes.find(p => p.id === processId);
      
      if (!process) {
        toast.error(`Process ${processId} not found`);
        failed++;
        continue;
      }

      try {
        toast.info(`Running process ${i + 1}/${processIds.length}: ${process.name}`);
        
        // Run the process and wait for it to complete
        const result = await runProcess(processId);
        results.push({
          processId,
          processName: process.name,
          status: result.status,
          workflowId: result.workflowId,
          duration: result.duration,
          environment: currentEnvironment.name
        });
        
        if (result.status === 'completed') {
          completed++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Error running process ${processId}:`, error);
        failed++;
        results.push({
          processId,
          processName: process.name,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          environment: currentEnvironment.name
        });
      }

      // Update batch progress
      const progress = ((i + 1) / processIds.length) * 100;
      setBatchProgress(progress);
      setBatchResults(prev => ({
        ...prev,
        completed,
        failed
      }));
    }

    // All processes completed
    setIsRunningBatch(false);
    
    const summary = {
      total: processIds.length,
      completed,
      failed,
      environment: currentEnvironment.name,
      results
    };

    toast.success(`Batch run completed: ${completed} succeeded, ${failed} failed`);
    
    // Send email report if requested
    if (emailReport) {
      try {
        await sendBatchReport(emailReport, summary);
        toast.success(`Report sent to ${emailReport}`);
      } catch (error) {
        toast.error(`Failed to send report: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return summary;
  }, [processes, runProcess, isRunningBatch, currentEnvironment]);

  return {
    runMultipleProcesses,
    isRunningBatch,
    batchProgress,
    batchResults
  };
}
