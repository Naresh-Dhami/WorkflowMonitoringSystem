
import { ProcessConfig } from "@/types";

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
