
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BatchJob, TestRun, WorkflowConfig } from "@/types";
import { triggerWorkflow, defaultWorkflows } from "@/utils/api";

export function useBatchJobs() {
  // State for workflows (API configurations)
  const [workflows, setWorkflows] = useState<WorkflowConfig[]>(() => {
    // Load from localStorage if available
    const savedWorkflows = localStorage.getItem('batchConnector.workflows');
    return savedWorkflows ? JSON.parse(savedWorkflows) : defaultWorkflows;
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
  
  // Save workflows to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('batchConnector.workflows', JSON.stringify(workflows));
  }, [workflows]);
  
  // Save test runs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('batchConnector.testRuns', JSON.stringify(testRuns));
  }, [testRuns]);
  
  // Function to add a new workflow
  const addWorkflow = useCallback((workflow: WorkflowConfig) => {
    setWorkflows(prev => [...prev, workflow]);
    toast.success(`Workflow "${workflow.name}" added successfully`);
  }, []);
  
  // Function to update an existing workflow
  const updateWorkflow = useCallback((updatedWorkflow: WorkflowConfig) => {
    setWorkflows(prev => 
      prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w)
    );
    toast.success(`Workflow "${updatedWorkflow.name}" updated successfully`);
  }, []);
  
  // Function to delete a workflow
  const deleteWorkflow = useCallback((workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    toast.success("Workflow deleted successfully");
  }, []);
  
  // Function to trigger a workflow execution
  const runWorkflow = useCallback(async (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    
    if (!workflow) {
      toast.error("Workflow not found");
      return;
    }
    
    setIsLoading(true);
    
    // Create a new batch job
    const newJob: BatchJob = {
      id: `job-${Date.now()}`,
      name: workflow.name,
      description: workflow.description,
      status: 'running',
      progress: 0,
      startTime: new Date()
    };
    
    // Add to active jobs
    setActiveJobs(prev => [...prev, newJob]);
    
    try {
      toast.info(`Starting workflow "${workflow.name}"...`);
      
      // Trigger the workflow execution
      const testRun = await triggerWorkflow(
        workflow,
        // Step completion callback
        (stepIndex, success, response, error) => {
          // Update job progress
          setActiveJobs(prev => 
            prev.map(job => {
              if (job.id === newJob.id) {
                const progress = ((stepIndex + 1) / workflow.steps.length) * 100;
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
            toast.success(`Step ${stepIndex + 1} completed: ${workflow.steps[stepIndex].name}`);
          } else {
            toast.error(`Step ${stepIndex + 1} failed: ${workflow.steps[stepIndex].name}`);
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
        toast.success(`Workflow "${workflow.name}" completed successfully`);
      } else {
        toast.error(`Workflow "${workflow.name}" ${testRun.status}`);
      }
    } catch (error) {
      // Handle any uncaught errors
      toast.error(`Error running workflow: ${error instanceof Error ? error.message : String(error)}`);
      
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
  }, [workflows]);
  
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
    workflows,
    testRuns,
    activeJobs,
    isLoading,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    runWorkflow
  };
}
