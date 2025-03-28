
import { toast } from "sonner";

// Interface for batch summary
interface BatchSummary {
  total: number;
  completed: number;
  failed: number;
  environment: string;
  results: Array<{
    processId: string;
    processName: string;
    status: string;
    workflowId?: string;
    duration?: number;
    error?: string;
    environment: string;
  }>;
}

/**
 * Sends a batch report email
 * In a real application, this would connect to an email service
 */
export const sendBatchReport = async (email: string, summary: BatchSummary): Promise<boolean> => {
  // Validate email
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address');
  }
  
  console.log(`Sending batch report to ${email}`, summary);
  
  // In a real implementation, this would use a real email service
  // For now, we'll simulate with a timeout
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For demo purposes, we'll succeed 90% of the time
      if (Math.random() > 0.1) {
        // Format would be something like:
        // To: email
        // Subject: Batch Process Run Report - [Environment Name]
        // Body: 
        //   Batch Summary:
        //   Environment: ${summary.environment}
        //   Total Processes: ${summary.total}
        //   Successful: ${summary.completed}
        //   Failed: ${summary.failed}
        //   
        //   Process Details:
        //   1. Process A (WF-123): Completed, Duration: 2m 30s
        //   2. Process B (WF-124): Failed, Error: API timeout
        //   ...
        console.log("Email sent successfully.");
        resolve(true);
      } else {
        reject(new Error('Failed to send email'));
      }
    }, 2000);
  });
};
