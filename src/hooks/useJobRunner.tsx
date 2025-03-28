
import { useCallback } from "react";
import { toast } from "sonner";
import { BatchJob, TestRun, ProcessConfig } from "@/types";
import { triggerProcess } from "@/utils/api";
import { useEnvironment } from "@/contexts/EnvironmentContext";

export function useJobRunner(
  processes: ProcessConfig[],
  addTestRun: (testRun: TestRun) => void,
  addJob: (job: BatchJob) => void,
  updateJob: (jobId: string, updates: Partial<BatchJob>) => void
) {
  const { currentEnvironment } = useEnvironment();
  
  // Function to trigger a process execution
  const runProcess = useCallback(async (processId: string) => {
    const process = processes.find(p => p.id === processId);
    
    if (!process) {
      toast.error("Process not found");
      throw new Error("Process not found");
    }
    
    // Create a new batch job
    const newJob: BatchJob = {
      id: `job-${Date.now()}`,
      name: process.name,
      description: process.description,
      status: 'running',
      progress: 0,
      startTime: new Date(),
      environment: currentEnvironment.id
    };
    
    // Add to active jobs
    addJob(newJob);
    
    try {
      toast.info(`Starting process "${process.name}" in ${currentEnvironment.name} environment...`);
      
      // Trigger the process execution
      const testRun = await triggerProcess(
        process,
        currentEnvironment.baseUrl,
        // Step completion callback
        (stepIndex, success, response, error) => {
          // Update job progress
          const progress = ((stepIndex + 1) / process.steps.length) * 100;
          updateJob(newJob.id, {
            progress: progress,
            status: success ? 'running' : 'failed'
          });
          
          // Show toast for step completion
          if (success) {
            toast.success(`Step ${stepIndex + 1} completed: ${process.steps[stepIndex].name}`);
          } else {
            toast.error(`Step ${stepIndex + 1} failed: ${process.steps[stepIndex].name}`);
          }
        },
        // Status check callback
        (status) => {
          updateJob(newJob.id, { status });
        }
      );
      
      // Add environment info to the test run
      const testRunWithEnv = {
        ...testRun,
        environment: currentEnvironment.id
      };
      
      // Add to test runs history
      addTestRun(testRunWithEnv);
      
      // Update job status
      const duration = testRun.endTime 
        ? (new Date(testRun.endTime).getTime() - new Date(testRun.startTime).getTime()) / 1000 
        : undefined;

      updateJob(newJob.id, {
        status: testRun.status,
        progress: 100,
        endTime: testRun.endTime,
        duration
      });
      
      // Show completion toast
      if (testRun.status === 'completed') {
        toast.success(`Process "${process.name}" completed successfully`);
      } else {
        toast.error(`Process "${process.name}" ${testRun.status}`);
      }

      // Return the test run for batch processing
      return {
        ...testRun,
        duration,
        environment: currentEnvironment.id
      };
    } catch (error) {
      // Handle any uncaught errors
      toast.error(`Error running process: ${error instanceof Error ? error.message : String(error)}`);
      
      // Update job status
      updateJob(newJob.id, {
        status: 'failed',
        endTime: new Date(),
        duration: newJob.startTime 
          ? (new Date().getTime() - newJob.startTime.getTime()) / 1000 
          : undefined
      });

      // Rethrow to handle in batch runner
      throw error;
    }
  }, [processes, addJob, updateJob, addTestRun, currentEnvironment]);
  
  return { runProcess };
}
