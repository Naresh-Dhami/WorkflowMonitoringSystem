
// Available message types for filtering
export const messageTypes = [
  "cache-operation",
  "compute-task",
  "cluster-operation"
];

// Message data structure
export interface GridGainMessage {
  id: string;
  workflowId: string;
  timestamp: string;
  details: string;
  status: string;
  type: string;
  environment?: string;
}

// Sample data for demonstration
export const sampleGridGainData: GridGainMessage[] = [
  {
    id: "1",
    workflowId: "WK2001",
    timestamp: "2023-09-15T10:30:00Z",
    details: JSON.stringify({ 
      operation: "cache-put", 
      key: "customer-123", 
      value: { name: "John Doe", age: 35, status: "active" }
    }, null, 2),
    status: "completed",
    type: "cache-operation",
    environment: "DEV"
  },
  {
    id: "2",
    workflowId: "WK2002",
    timestamp: "2023-09-15T11:15:00Z",
    details: JSON.stringify({ 
      operation: "compute-task", 
      nodes: 5, 
      duration: 325, 
      result: "success" 
    }, null, 2),
    status: "completed",
    type: "compute-task",
    environment: "SIT"
  },
  {
    id: "3",
    workflowId: "WK2003",
    timestamp: "2023-09-15T12:00:00Z",
    details: JSON.stringify({ 
      operation: "cluster-rebalance", 
      nodes: 4, 
      partitions: 128, 
      progress: 0.75
    }, null, 2),
    status: "running",
    type: "cluster-operation",
    environment: "QA"
  },
  {
    id: "4",
    workflowId: "WK2004",
    timestamp: "2023-09-15T12:45:00Z",
    details: JSON.stringify({ 
      operation: "cache-get", 
      key: "product-456", 
      error: "Cache entry not found" 
    }, null, 2),
    status: "failed",
    type: "cache-operation",
    environment: "UAT"
  },
  // Add more sample data for pagination testing
  ...[...Array(15)].map((_, i) => ({
    id: `${i + 5}`,
    workflowId: `WK${2005 + i}`,
    timestamp: new Date(2023, 8, 15, 12 + Math.floor(i/2), (i % 2) * 30).toISOString(),
    details: JSON.stringify({ 
      operation: i % 3 === 0 ? "cache-put" : i % 3 === 1 ? "compute-task" : "cluster-rebalance",
      key: `key-${i}`,
      value: { data: `Sample data ${i}` }
    }, null, 2),
    status: i % 3 === 0 ? "completed" : i % 3 === 1 ? "running" : "failed",
    type: i % 3 === 0 ? "cache-operation" : i % 3 === 1 ? "compute-task" : "cluster-operation",
    environment: i % 4 === 0 ? "DEV" : i % 4 === 1 ? "SIT" : i % 4 === 2 ? "QA" : "UAT"
  }))
];
