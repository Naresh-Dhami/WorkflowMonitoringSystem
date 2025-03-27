
import { useState, useEffect } from "react";
import { BatchJob } from "@/types";

export function useActiveJobs() {
  // State for active batch jobs (currently running)
  const [activeJobs, setActiveJobs] = useState<BatchJob[]>([]);
  
  // Add a new job to active jobs
  const addJob = (job: BatchJob) => {
    setActiveJobs(prev => [...prev, job]);
  };
  
  // Update an existing job
  const updateJob = (jobId: string, updates: Partial<BatchJob>) => {
    setActiveJobs(prev => 
      prev.map(job => {
        if (job.id === jobId) {
          return { ...job, ...updates };
        }
        return job;
      })
    );
  };
  
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
    activeJobs,
    addJob,
    updateJob
  };
}
