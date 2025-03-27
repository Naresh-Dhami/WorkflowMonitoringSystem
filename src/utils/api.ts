
import { ApiConfig, Status, TestRun, WorkflowConfig } from "@/types";

// Mock function to simulate API calls
export const executeApiCall = async (config: ApiConfig): Promise<any> => {
  console.log(`Executing API call to ${config.endpoint}`);
  
  // In a real implementation, this would use fetch or axios
  // For now, we'll simulate the API call with a timeout
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      if (Math.random() > 0.2) {
        resolve({
          status: 200,
          data: { success: true, message: `Successfully executed ${config.name}` }
        });
      } else {
        reject(new Error(`Failed to execute ${config.name}`));
      }
    }, 1500 + Math.random() * 3000); // Random delay between 1.5 and 4.5 seconds
  });
};

// Check workflow completion status
export const checkWorkflowStatus = async (endpoint: string, workflowId: string): Promise<Status> => {
  console.log(`Checking workflow status for ${workflowId} at ${endpoint}`);
  
  // In a real implementation, this would use fetch or axios to call the endpoint
  // For now, we'll simulate with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Randomly determine status for demo purposes
      const statuses: Status[] = ['running', 'completed', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      resolve(randomStatus);
    }, 1000);
  });
};

// Function to trigger a workflow
export const triggerWorkflow = async (
  workflow: WorkflowConfig,
  onStepComplete?: (stepIndex: number, success: boolean, response?: any, error?: any) => void,
  onStatusCheck?: (status: Status) => void
): Promise<TestRun> => {
  const testRun: TestRun = {
    id: `run-${Date.now()}`,
    workflowId: workflow.id,
    startTime: new Date(),
    status: 'running',
    steps: workflow.steps.map(step => ({
      apiConfigId: step.id,
      status: 'idle'
    }))
  };

  // Execute each step sequentially
  for (let i = 0; i < workflow.steps.length; i++) {
    const step = workflow.steps[i];
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
      
      // If a step fails, mark the entire workflow as failed
      testRun.status = 'failed';
      testRun.endTime = new Date();
      return testRun;
    }
  }

  // If workflow has a completion check endpoint, poll it for status
  if (workflow.completionCheckEndpoint) {
    let status: Status = 'running';
    
    // Poll every 3 seconds for up to 5 minutes
    for (let i = 0; i < 100 && status === 'running'; i++) {
      status = await checkWorkflowStatus(workflow.completionCheckEndpoint, workflow.id);
      
      if (onStatusCheck) {
        onStatusCheck(status);
      }
      
      if (status !== 'running') {
        break;
      }
      
      // Wait 3 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    testRun.status = status;
  } else {
    // If no completion check endpoint, assume completed if all steps succeeded
    testRun.status = 'completed';
  }
  
  testRun.endTime = new Date();
  return testRun;
};

// Default sample workflow configurations
export const defaultWorkflows: WorkflowConfig[] = [
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
