
export type Status = 'idle' | 'running' | 'completed' | 'failed';

export interface BatchJob {
  id: string;
  name: string;
  description: string;
  status: Status;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  environment?: string;
}

export interface ApiConfig {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
  successCriteria?: {
    statusCode?: number;
    responseMatch?: string;
  };
}

export interface ProcessConfig {
  id: string;
  name: string;
  description: string;
  steps: ApiConfig[];
  completionCheckEndpoint?: string;
}

export interface TestRun {
  id: string;
  processId: string;
  workflowId?: string; // Dynamic ID received from API
  startTime: Date;
  endTime?: Date;
  status: Status;
  steps: {
    apiConfigId: string;
    status: Status;
    response?: any;
    error?: string;
    startTime?: Date;
    endTime?: Date;
  }[];
  environment?: string;
}

export interface DCAmpsServer {
  serverName: string;
  hostId: string;
  url: string;
  status: string;
  environment?: string;
}

export interface TopicDetail {
  id: string;
  topic: string;
  partition: number;
  offset: number;
  timestamp: string;
  status: string;
  message?: string;
}
