
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BatchJob, TestRun, ProcessConfig } from "@/types";
import { triggerProcess, defaultProcesses } from "@/utils/api";
import { loadProcessConfigs, saveProcessConfig, deleteProcessConfig } from "@/utils/configStorage";

export function useBatchJobs() {
  // State for processes (API configurations)
  const [processes, setProcesses] = useState<ProcessConfig[]>(() => {
    // Load from localStorage/JSON file if available
    const savedProcesses = loadProcessConfigs();
    return savedProcesses.length > 0 ? savedProcesses : defaultProcesses;
  });
  
  // State for test runs
  const [testRuns, setTestRuns] = useState<TestRun[]>(() => {
    const savedRuns = localStorage.getItem('batchConnector.testRuns');
    return savedRuns ? JSON.parse(savedRuns) : [];
  });
  
  // State for active batch jobs (currently running)
  const [activeJobs, setActiveJobs] = useState<BatchJob[]>([]);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // Save test runs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('batchConnector.testRuns', JSON.stringify(testRuns));
  }, [testRuns]);
  
  // Function to add a new process
  const addProcess = useCallback((process: ProcessConfig) => {
    setProcesses(prev => [...prev, process]);
    saveProcessConfig(process);
    toast.success(`Process "${process.name}" added successfully`);
  }, []);
  
  // Function to update an existing process
  const updateProcess = useCallback((updatedProcess: ProcessConfig) => {
    setProcesses(prev => 
      prev.map(w => w.id === updatedProcess.id ? updatedProcess : w)
    );
    saveProcessConfig(updatedProcess);
    toast.success(`Process "${updatedProcess.name}" updated successfully`);
  }, []);
  
  // Function to delete a process
  const deleteProcess = useCallback((processId: string) => {
    setProcesses(prev => prev.filter(p => p.id !== processId));
    deleteProcessConfig(processId);
  }, []);
  
  // Function to trigger a process execution
  const runProcess = useCallback(async (processId: string) => {
    const process = processes.find(p => p.id === processId);
    
    if (!process) {
      toast.error("Process not found");
      return;
    }
    
    setIsLoading(true);
    
    // Create a new batch job
    const newJob: BatchJob = {
      id: `job-${Date.now()}`,
      name: process.name,
      description: process.description,
      status: 'running',
      progress: 0,
      startTime: new Date()
    };
    
    // Add to active jobs
    setActiveJobs(prev => [...prev, newJob]);
    
    try {
      toast.info(`Starting process "${process.name}"...`);
      
      // Trigger the process execution
      const testRun = await triggerProcess(
        process,
        // Step completion callback
        (stepIndex, success, response, error) => {
          // Update job progress
          setActiveJobs(prev => 
            prev.map(job => {
              if (job.id === newJob.id) {
                const progress = ((stepIndex + 1) / process.steps.length) * 100;
                return {
                  ...job,
                  progress: progress,
                  status: success ? job.status : 'failed'
                };
              }
              return job;
            })
          );
          
          // Show toast for step completion
          if (success) {
            toast.success(`Step ${stepIndex + 1} completed: ${process.steps[stepIndex].name}`);
          } else {
            toast.error(`Step ${stepIndex + 1} failed: ${process.steps[stepIndex].name}`);
          }
        },
        // Status check callback
        (status) => {
          setActiveJobs(prev => 
            prev.map(job => {
              if (job.id === newJob.id) {
                return { ...job, status };
              }
              return job;
            })
          );
        }
      );
      
      // Add to test runs history
      setTestRuns(prev => [...prev, testRun]);
      
      // Update job status
      setActiveJobs(prev => 
        prev.map(job => {
          if (job.id === newJob.id) {
            return {
              ...job,
              status: testRun.status,
              progress: 100,
              endTime: testRun.endTime,
              duration: testRun.endTime 
                ? (testRun.endTime.getTime() - testRun.startTime.getTime()) / 1000 
                : undefined
            };
          }
          return job;
        })
      );
      
      // Show completion toast
      if (testRun.status === 'completed') {
        toast.success(`Process "${process.name}" completed successfully`);
      } else {
        toast.error(`Process "${process.name}" ${testRun.status}`);
      }
    } catch (error) {
      // Handle any uncaught errors
      toast.error(`Error running process: ${error instanceof Error ? error.message : String(error)}`);
      
      // Update job status
      setActiveJobs(prev => 
        prev.map(job => {
          if (job.id === newJob.id) {
            return {
              ...job,
              status: 'failed',
              endTime: new Date(),
              duration: job.startTime 
                ? (new Date().getTime() - job.startTime.getTime()) / 1000 
                : undefined
            };
          }
          return job;
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [processes]);
  
  // Remove completed jobs from active jobs after 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      setActiveJobs(prev => 
        prev.filter(job => 
          job.status === 'running' || 
          (job.endTime && job.endTime > fiveMinutesAgo)
        )
      );
    }, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
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
