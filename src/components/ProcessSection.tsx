
import { useState } from "react";
import { ProcessConfig } from "@/types";
import BatchCard from "@/components/BatchCard";
import StatusBadge from "@/components/StatusBadge";
import { BatchJob, TestRun } from "@/types";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Plus } from "lucide-react";

interface ProcessSectionProps {
  processes: ProcessConfig[];
  testRuns: TestRun[];
  activeJobs: BatchJob[];
  isLoading: boolean;
  onNewProcess: () => void;
  onRunProcess: (processId: string) => void;
  onEditProcess: (process: ProcessConfig) => void;
  onDeleteProcess: (processId: string) => void;
}

const ProcessSection = ({
  processes,
  testRuns,
  activeJobs,
  isLoading,
  onNewProcess,
  onRunProcess,
  onEditProcess,
  onDeleteProcess,
}: ProcessSectionProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Helper functions
  const getLastRunForProcess = (processId: string) => {
    return testRuns
      .filter(run => run.processId === processId)
      .sort((a, b) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      )[0];
  };
  
  const getActiveJobForProcess = (processId: string) => {
    return activeJobs.find(job => 
      job.name === processes.find(p => p.id === processId)?.name
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Processes</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-accent' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${viewMode === 'list' ? 'bg-accent' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {processes.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-white/50">
          <h3 className="text-lg font-medium mb-2">No processes configured</h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first process
          </p>
          <Button 
            onClick={onNewProcess}
            className="btn-animation"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Process
          </Button>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processes.map((process, index) => (
              <div 
                key={process.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BatchCard 
                  process={process}
                  activeJob={getActiveJobForProcess(process.id)}
                  lastRun={getLastRunForProcess(process.id)}
                  onRunClick={onRunProcess}
                  onEditClick={onEditProcess}
                  onDeleteClick={onDeleteProcess}
                  isLoading={isLoading}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {processes.map((process, index) => {
              const activeJob = getActiveJobForProcess(process.id);
              const lastRun = getLastRunForProcess(process.id);
              return (
                <div 
                  key={process.id} 
                  className="animate-slide-up p-4 rounded-lg border bg-white/50 shadow-sm hover:shadow transition-all"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{process.name}</h3>
                      <p className="text-sm text-muted-foreground">{process.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {(activeJob || lastRun) && (
                        <StatusBadge 
                          status={activeJob?.status || lastRun?.status || 'idle'}
                          size="sm" 
                        />
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditProcess(process)}
                      >
                        Configure
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteProcess(process.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        Delete
                      </Button>
                      
                      <Button 
                        onClick={() => onRunProcess(process.id)}
                        disabled={isLoading || activeJob?.status === 'running'}
                        size="sm"
                      >
                        {activeJob?.status === 'running' ? 'Running...' : 'Run'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </section>
  );
};

export default ProcessSection;
