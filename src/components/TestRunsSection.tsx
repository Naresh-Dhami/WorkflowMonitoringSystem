
import { TestRun, ProcessConfig } from "@/types";
import StatusBadge from "@/components/StatusBadge";

interface TestRunsSectionProps {
  testRuns: TestRun[];
  processes: ProcessConfig[];
}

const TestRunsSection = ({ testRuns, processes }: TestRunsSectionProps) => {
  if (testRuns.length === 0) {
    return null;
  }
  
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Test Runs</h2>
      </div>
      
      <div className="overflow-hidden rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="font-medium text-left p-3">Process</th>
                <th className="font-medium text-left p-3">Workflow ID</th>
                <th className="font-medium text-left p-3">Start Time</th>
                <th className="font-medium text-left p-3">End Time</th>
                <th className="font-medium text-left p-3">Duration</th>
                <th className="font-medium text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {testRuns
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .slice(0, 10)
                .map((run) => {
                  const process = processes.find(p => p.id === run.processId);
                  const duration = run.endTime 
                    ? (new Date(run.endTime).getTime() - new Date(run.startTime).getTime()) / 1000
                    : undefined;
                    
                  return (
                    <tr key={run.id} className="border-t hover:bg-muted/20">
                      <td className="p-3">{process?.name || 'Unknown'}</td>
                      <td className="p-3 text-xs">{run.workflowId || '-'}</td>
                      <td className="p-3">{new Date(run.startTime).toLocaleString()}</td>
                      <td className="p-3">
                        {run.endTime ? new Date(run.endTime).toLocaleString() : '-'}
                      </td>
                      <td className="p-3">
                        {duration 
                          ? duration < 60 
                            ? `${Math.round(duration)}s` 
                            : `${Math.floor(duration / 60)}m ${Math.round(duration % 60)}s`
                          : '-'
                        }
                      </td>
                      <td className="p-3">
                        <StatusBadge status={run.status} size="sm" />
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TestRunsSection;
