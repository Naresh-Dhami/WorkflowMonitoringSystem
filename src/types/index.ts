
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

export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  steps: ApiConfig[];
  completionCheckEndpoint?: string;
}

export interface TestRun {
  id: string;
  workflowId: string;
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
}
