
import { toast } from "sonner";
import { ApiConfig } from "@/types";

// Mock function to simulate API calls
export const executeApiCall = async (config: ApiConfig, baseUrl: string, workflowId?: string): Promise<any> => {
  // Ensure we use the environment's baseUrl properly
  const fullEndpoint = baseUrl && config.endpoint ? `${baseUrl}${config.endpoint}` : config.endpoint;
  console.log(`Executing API call to ${fullEndpoint}`, { workflowId });
  
  // In a real implementation, this would use fetch or axios with the workflowId
  // For now, we'll simulate the API call with a timeout
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      if (Math.random() > 0.2) {
        // Generate a random workflowId if this is the first step and no workflowId provided
        const response = {
          status: 200,
          data: { 
            success: true, 
            message: `Successfully executed ${config.name}`,
            workflowId: workflowId || `WK${Date.now().toString().substring(7)}-${Math.floor(Math.random() * 1000)}`
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
export const checkProcessStatus = async (endpoint: string, baseUrl: string, workflowId: string): Promise<Status> => {
  // Ensure we use the environment's baseUrl properly
  const fullEndpoint = baseUrl && endpoint ? `${baseUrl}${endpoint}` : endpoint;
  console.log(`Checking process status for ${workflowId} at ${fullEndpoint}`);
  
  // In a real implementation, this would use fetch or axios to call the endpoint with the workflowId
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

// Import Status type from types module
import { Status } from "@/types";

// Function to poll for process status
export const pollProcessStatus = async (
  endpoint: string,
  baseUrl: string,
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
    currentStatus = await checkProcessStatus(endpoint, baseUrl, workflowId);
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

// Function to make API calls to specific endpoints
export const makeApiCall = async (endpoint: string, baseUrl: string, method: string = 'GET', body?: any): Promise<any> => {
  // Ensure we use the environment's baseUrl properly
  const fullEndpoint = baseUrl && endpoint ? `${baseUrl}${endpoint}` : endpoint;
  console.log(`Making ${method} API call to ${fullEndpoint}`, { body });
  
  // In a real implementation, this would use fetch or axios
  // For now, we'll simulate the API call with a timeout
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      if (Math.random() > 0.1) {
        const response = {
          status: 200,
          data: {
            success: true,
            message: `Successfully executed ${method} on ${endpoint}`,
            data: body ? { ...body, processed: true } : { result: "Success" }
          }
        };
        resolve(response);
      } else {
        reject(new Error(`Failed to execute ${method} on ${endpoint}`));
      }
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  });
};
