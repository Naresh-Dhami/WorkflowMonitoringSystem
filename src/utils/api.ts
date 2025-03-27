
import { ApiConfig, Status, TestRun, ProcessConfig } from "@/types";
import { toast } from "sonner";
import { saveProcessConfig } from "./configStorage";

// Mock function to simulate API calls
export const executeApiCall = async (config: ApiConfig): Promise<any> => {
  console.log(`Executing API call to ${config.endpoint}`);
  
  // In a real implementation, this would use fetch or axios
  // For now, we'll simulate the API call with a timeout
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      if (Math.random() > 0.2) {
        // Generate a random workflowId if this is the first step
        const response = {
          status: 200,
          data: { 
            success: true, 
            message: `Successfully executed ${config.name}`,
            workflowId: `WK${Date.now().toString().substring(7)}-${Math.floor(Math.random() * 1000)}`
          }
        };
        resolve(response);
      } else {
        reject(new Error(`Failed to execute ${config.name}`));
      }
    }, 1500 + Math.random() * 3000); // Random delay between 1.5 and 4.5 seconds
  });
};

// Check process completion status
export const checkProcessStatus = async (endpoint: string, workflowId: string): Promise<Status> => {
  console.log(`Checking process status for ${workflowId} at ${endpoint}`);
  
  // In a real implementation, this would use fetch or axios to call the endpoint
  // For now, we'll simulate with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Weighted random status for more realistic simulation
      // The longer a workflow runs, the more likely it is to complete
      const rand = Math.random();
      let status: Status;
      
      // First few checks are likely to be "running"
      if (rand < 0.7) {
        status = 'running';
      } else if (rand < 0.9) {
        status = 'completed';
      } else {
        status = 'failed';
      }
      
      console.log(`Status check for ${workflowId}: ${status}`);
      resolve(status);
    }, 1000);
  });
};

// Function to poll for process status
export const pollProcessStatus = async (
  endpoint: string,
  workflowId: string,
  onStatusUpdate: (status: Status) => void,
  intervalMs: number = 5000, // Default 5 seconds
  maxAttempts: number = 20 // Default 100 seconds max
): Promise<Status> => {
  console.log(`Starting to poll process status for ${workflowId}`);
  
  let attempts = 0;
  let currentStatus: Status = 'running';
  
  while (attempts < maxAttempts && currentStatus === 'running') {
    attempts++;
    currentStatus = await checkProcessStatus(endpoint, workflowId);
    onStatusUpdate(currentStatus);
    
    if (currentStatus !== 'running') {
      return currentStatus;
    }
    
    // Wait for the specified interval
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  // If we reach max attempts and status is still running, return as is
  return currentStatus;
};

// Function to trigger a process
export const triggerProcess = async (
  process: ProcessConfig,
  onStepComplete?: (stepIndex: number, success: boolean, response?: any, error?: any) => void,
  onStatusUpdate?: (status: Status) => void
): Promise<TestRun> => {
  const testRun: TestRun = {
    id: `run-${Date.now()}`,
    processId: process.id,
    startTime: new Date(),
    status: 'running',
    steps: process.steps.map(step => ({
      apiConfigId: step.id,
      status: 'idle'
    }))
  };

  // Execute the first step to get the workflowId
  try {
    testRun.steps[0].status = 'running';
    testRun.steps[0].startTime = new Date();
    
    const response = await executeApiCall(process.steps[0]);
    testRun.steps[0].status = 'completed';
    testRun.steps[0].endTime = new Date();
    testRun.steps[0].response = response;
    
    // Extract workflowId from the response
    const workflowId = response.data?.workflowId;
    if (workflowId) {
      testRun.workflowId = workflowId;
      console.log(`Received workflowId: ${workflowId}`);
    }
    
    if (onStepComplete) {
      onStepComplete(0, true, response);
    }
  } catch (error) {
    testRun.steps[0].status = 'failed';
    testRun.steps[0].endTime = new Date();
    testRun.steps[0].error = error instanceof Error ? error.message : String(error);
    
    if (onStepComplete) {
      onStepComplete(0, false, undefined, error);
    }
    
    testRun.status = 'failed';
    testRun.endTime = new Date();
    return testRun;
  }

  // Execute remaining steps if first step was successful
  for (let i = 1; i < process.steps.length; i++) {
    const step = process.steps[i];
    testRun.steps[i].status = 'running';
    testRun.steps[i].startTime = new Date();
    
    try {
      const response = await executeApiCall(step);
      testRun.steps[i].status = 'completed';
      testRun.steps[i].endTime = new Date();
      testRun.steps[i].response = response;
      
      if (onStepComplete) {
        onStepComplete(i, true, response);
      }
    } catch (error) {
      testRun.steps[i].status = 'failed';
      testRun.steps[i].endTime = new Date();
      testRun.steps[i].error = error instanceof Error ? error.message : String(error);
      
      if (onStepComplete) {
        onStepComplete(i, false, undefined, error);
      }
      
      testRun.status = 'failed';
      testRun.endTime = new Date();
      return testRun;
    }
  }

  // Begin polling for status if there's a workflowId and completion check endpoint
  if (testRun.workflowId && process.completionCheckEndpoint) {
    toast.info(`Starting to monitor process status with ID: ${testRun.workflowId}`);
    
    try {
      const finalStatus = await pollProcessStatus(
        process.completionCheckEndpoint,
        testRun.workflowId,
        (status) => {
          if (onStatusUpdate) {
            onStatusUpdate(status);
          }
        }
      );
      
      testRun.status = finalStatus;
      toast.info(`Process status: ${finalStatus}`);
    } catch (error) {
      console.error('Error during status polling:', error);
      testRun.status = 'failed';
      toast.error(`Failed to monitor process status: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    // If no polling needed, assume completed if all steps succeeded
    testRun.status = 'completed';
  }
  
  testRun.endTime = new Date();
  return testRun;
};

// Default sample process configurations
export const defaultProcesses: ProcessConfig[] = [
  {
    id: 'eod-batch',
    name: 'EOD Batch Process',
    description: 'End of day batch processing workflow',
    steps: [
      {
        id: 'trigger-eod',
        name: 'Trigger EOD Batch',
        endpoint: '/api/batch/eod/trigger',
        method: 'POST',
        body: { date: new Date().toISOString().split('T')[0] }
      }
    ],
    completionCheckEndpoint: '/api/batch/eod/status'
  },
  {
    id: 'data-sync',
    name: 'Data Synchronization',
    description: 'Sync data across systems',
    steps: [
      {
        id: 'export-data',
        name: 'Export Data',
        endpoint: '/api/data/export',
        method: 'POST'
      },
      {
        id: 'transform-data',
        name: 'Transform Data',
        endpoint: '/api/data/transform',
        method: 'POST'
      },
      {
        id: 'import-data',
        name: 'Import Data',
        endpoint: '/api/data/import',
        method: 'POST'
      }
    ],
    completionCheckEndpoint: '/api/data/sync/status'
  },
  {
    id: 'report-generation',
    name: 'Report Generation',
    description: 'Generate daily reports',
    steps: [
      {
        id: 'generate-reports',
        name: 'Generate Reports',
        endpoint: '/api/reports/generate',
        method: 'POST',
        body: { reportType: 'daily' }
      },
      {
        id: 'distribute-reports',
        name: 'Distribute Reports',
        endpoint: '/api/reports/distribute',
        method: 'POST'
      }
    ]
  }
];
