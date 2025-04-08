
export interface AmpsMessage {
  id: string;
  workflowId: string;
  timestamp: string;
  details: string;
  status: string;
  type: string;
  environment?: string;
  data?: {
    serverName?: string;
    url?: string;
    [key: string]: any;  // Allow for additional properties
  };
  topicDetail?: any;
}

// Available message types for filtering
export const messageTypes = [
  "init",
  "process",
  "validate",
  "DC AMPS"
];

// Sample data for demonstration
export const sampleAmpsData: AmpsMessage[] = [
  {
    id: "1",
    workflowId: "WK1001",
    timestamp: "2023-09-15T10:30:00Z",
    details: JSON.stringify({ message: "Process started", action: "init" }, null, 2),
    status: "completed",
    type: "init",
    environment: "DEV"
  },
  {
    id: "2",
    workflowId: "WK1002",
    timestamp: "2023-09-15T11:15:00Z",
    details: JSON.stringify({ message: "Data processing", action: "process", items: 150 }, null, 2),
    status: "running",
    type: "process",
    environment: "SIT"
  },
  {
    id: "3",
    workflowId: "WK1003",
    timestamp: "2023-09-15T12:00:00Z",
    details: JSON.stringify({ message: "Error in data validation", action: "validate", error: "Invalid format" }, null, 2),
    status: "failed",
    type: "validate",
    environment: "QA"
  },
  // Add DC AMPS sample
  {
    id: "dc-1",
    workflowId: "WPPRAP9A0396",
    timestamp: new Date().toISOString(),
    details: "DC AMPS Server Information",
    status: "Active",
    type: "DC AMPS",
    environment: "PROD",
    data: {
      serverName: "PROD_XAE_DC6",
      url: "WPPRAP9A0396.wellsfargo.com:9023"
    }
  },
  // Add more sample data for pagination testing
  ...[...Array(15)].map((_, i) => ({
    id: `${i + 4}`,
    workflowId: `WK${1004 + i}`,
    timestamp: new Date(2023, 8, 15, 12 + Math.floor(i/2), (i % 2) * 30).toISOString(),
    details: JSON.stringify({ message: `Sample message ${i + 4}`, action: i % 3 === 0 ? "init" : i % 3 === 1 ? "process" : "validate" }, null, 2),
    status: i % 3 === 0 ? "completed" : i % 3 === 1 ? "running" : "failed",
    type: i % 3 === 0 ? "init" : i % 3 === 1 ? "process" : "validate",
    environment: i % 3 === 0 ? "DEV" : i % 3 === 1 ? "SIT" : "QA"
  }))
];
