
import { ApiConfig, ProcessConfig, Status, TestRun } from "@/types";
import { toast } from "sonner";
import { executeApiCall, pollProcessStatus } from "./core";

// Function to trigger a process
export const triggerProcess = async (
  process: ProcessConfig,
  baseUrl: string,
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
    
    const response = await executeApiCall(process.steps[0], baseUrl);
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
      // Pass the workflowId to subsequent API calls
      const response = await executeApiCall(step, baseUrl, testRun.workflowId);
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
        baseUrl,
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
