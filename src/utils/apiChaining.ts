
/**
 * Utility functions for API chaining - using results from one API call in another
 */

import { toast } from "sonner";

// Example API fetching function 
export const fetchWorkflowDetails = async (workflowId: string) => {
  try {
    // Simulate API call
    const response = await fetch(`/api/workflows/${workflowId}`);
    if (!response.ok) throw new Error('Failed to fetch workflow details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching workflow details:', error);
    toast.error('Failed to fetch workflow details');
    return null;
  }
};

// Example of chaining API calls
export const fetchWorkflowWithMessages = async (workflowId: string) => {
  try {
    // First API call to get workflow details
    const workflowDetails = await fetchWorkflowDetails(workflowId);
    
    if (!workflowDetails) return null;
    
    // Use data from first API call to make second API call
    const messagesResponse = await fetch(`/api/messages?workflowId=${workflowId}&type=${workflowDetails.type}`);
    if (!messagesResponse.ok) throw new Error('Failed to fetch messages');
    
    const messages = await messagesResponse.json();
    
    // Return combined data
    return {
      workflow: workflowDetails,
      messages: messages
    };
  } catch (error) {
    console.error('Error in API chain:', error);
    toast.error('Failed to fetch workflow with messages');
    return null;
  }
};

// Example of fetching related entities
export const fetchRelatedEntities = async (workflowId: string) => {
  try {
    // Get workflow details
    const workflowResult = await fetchWorkflowWithMessages(workflowId);
    if (!workflowResult) return null;
    
    // Parallel API calls using data from previous call
    const [amps, gridGain] = await Promise.all([
      fetch(`/api/amps?correlationId=${workflowResult.workflow.correlationId}`).then(res => res.json()),
      fetch(`/api/gridgain?correlationId=${workflowResult.workflow.correlationId}`).then(res => res.json())
    ]);
    
    // Return all data combined
    return {
      ...workflowResult,
      amps,
      gridGain
    };
  } catch (error) {
    console.error('Error fetching related entities:', error);
    toast.error('Failed to fetch related entities');
    return null;
  }
};

// Example usage in a component:
/*
import { fetchRelatedEntities } from '@/utils/apiChaining';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const loadData = async (workflowId) => {
    setLoading(true);
    try {
      const result = await fetchRelatedEntities(workflowId);
      setData(result);
    } finally {
      setLoading(false);
    }
  };
  
  // ...render logic
}
*/
