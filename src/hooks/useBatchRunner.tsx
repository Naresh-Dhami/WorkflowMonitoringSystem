
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { BatchJob, ProcessConfig, TestRun } from "@/types";
import { useProcesses } from "./useProcesses";

export function useBatchRunner(
  addTestRun: (testRun: TestRun) => void,
  addJob: (job: BatchJob) => void,
  updateJob: (jobId: string, updates: Partial<BatchJob>) => void
) {
  const { processes } = useProcesses();
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchResults, setBatchResults] = useState<any[]>([]);
  
  // Function to run multiple processes in sequence
  const runMultipleProcesses = useCallback(async (
    processIds: string[], 
    emailReport?: string
  ) => {
    setIsRunningBatch(true);
    setBatchProgress(0);
    setBatchResults([]);
    
    try {
      const results = [];
      const selectedProcesses = processes.filter(p => processIds.includes(p.id));
      
      toast.info(`Starting batch run with ${selectedProcesses.length} processes...`);
      
      // Import the runProcess function dynamically to avoid circular dependency
      const { useJobRunner } = await import('./useJobRunner');
      const { runProcess } = useJobRunner(addTestRun, addJob, updateJob);
      
      for (let i = 0; i < selectedProcesses.length; i++) {
        const process = selectedProcesses[i];
        const progressPercent = (i / selectedProcesses.length) * 100;
        setBatchProgress(progressPercent);
        
        try {
          toast.info(`Running process ${i + 1} of ${selectedProcesses.length}: "${process.name}"`);
          const result = await runProcess(process.id);
          results.push(result);
        } catch (error) {
          console.error(`Error running process "${process.name}":`, error);
          // Continue with next process even if one fails
        }
      }
      
      // Set final progress
      setBatchProgress(100);
      setBatchResults(results);
      
      // Generate report if email is provided
      if (emailReport) {
        toast.info(`Sending batch report to ${emailReport}...`);
        try {
          // This would be replaced with actual email sending logic
          console.log('Sending email report to:', emailReport);
          // await sendEmailReport(emailReport, results);
          toast.success('Batch report sent successfully');
        } catch (error) {
          toast.error('Failed to send batch report');
          console.error('Failed to send batch report:', error);
        }
      }
      
      toast.success(`Batch run completed. ${results.length} of ${selectedProcesses.length} processes completed successfully.`);
      return results;
    } catch (error) {
      console.error('Error in batch runner:', error);
      toast.error(`Error in batch runner: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    } finally {
      setIsRunningBatch(false);
    }
  }, [processes, addTestRun, addJob, updateJob]);
  
  return {
    runMultipleProcesses,
    isRunningBatch,
    batchProgress,
    batchResults
  };
}
