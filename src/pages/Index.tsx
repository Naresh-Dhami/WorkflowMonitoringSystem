
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import BatchCard from "@/components/BatchCard";
import ConfigModal from "@/components/ConfigModal";
import StatusBadge from "@/components/StatusBadge";
import { useBatchJobs } from "@/hooks/useBatchJobs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ProcessConfig } from "@/types";
import { Clock, Filter, LayoutGrid, List, Plus, RefreshCw } from "lucide-react";
import { importConfigFromFile } from "@/utils/configStorage";

const Index = () => {
  const { 
    processes, 
    testRuns, 
    activeJobs, 
    isLoading, 
    addProcess, 
    updateProcess, 
    deleteProcess, 
    runProcess 
  } = useBatchJobs();
  
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeProcess, setActiveProcess] = useState<ProcessConfig | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file import
  const handleImportConfig = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedConfig = JSON.parse(content);
        
        // Validate imported config
        if (Array.isArray(parsedConfig) && parsedConfig.every(item => 
          item.id && item.name && Array.isArray(item.steps)
        )) {
          // Reset file input
          if (event.target) {
            event.target.value = '';
          }
          
          // Import all processes at once
          const importedProcesses = importConfigFromFile(content);
          toast.success(`Successfully imported ${importedProcesses.length} processes`);
        } else {
          toast.error("Invalid configuration format");
        }
      } catch (error) {
        toast.error("Failed to parse configuration file");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };
  
  // Handle config export
  const handleExportConfig = () => {
    const configJson = JSON.stringify(processes, null, 2);
    const blob = new Blob([configJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "batch-connector-config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Configuration exported successfully");
  };
  
  const handleSaveProcess = (process: ProcessConfig) => {
    if (activeProcess) {
      updateProcess(process);
    } else {
      addProcess(process);
    }
    setActiveProcess(undefined);
  };
  
  // Find the last test run for each process
  const getLastRunForProcess = (processId: string) => {
    return testRuns
      .filter(run => run.processId === processId)
      .sort((a, b) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      )[0];
  };
  
  // Find the active job for process
  const getActiveJobForProcess = (processId: string) => {
    return activeJobs.find(job => 
      job.name === processes.find(p => p.id === processId)?.name
    );
  };
  
  // Animation styles
  const containerAnimationClass = "animate-fade-in";
  const itemAnimationClass = "animate-slide-up";
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        onNewProcess={() => {
          setActiveProcess(undefined);
          setIsConfigModalOpen(true);
        }}
        onImportConfig={handleImportConfig}
        onExportConfig={handleExportConfig}
      />
      
      {/* Hidden file input for import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />
      
      <main className="max-w-6xl mx-auto pt-24 px-6 pb-16">
        <div className={`${containerAnimationClass} space-y-6`}>
          {/* Active jobs section */}
          {activeJobs.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold tracking-tight">Active Jobs</h2>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {activeJobs.length} running
                  </span>
                </div>
              </div>
              
              <div className="grid gap-4">
                {activeJobs.map(job => (
                  <div 
                    key={job.id} 
                    className={`${itemAnimationClass} p-4 rounded-lg border bg-white/50 backdrop-blur-sm shadow-sm`}
                    style={{ animationDelay: '100ms' }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <h3 className="font-medium">{job.name}</h3>
                        <StatusBadge status={job.status} className="ml-2" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Started at {new Date(job.startTime || 0).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.round(job.progress)}%</span>
                      </div>
                      <Progress 
                        value={job.progress} 
                        className={`h-1.5 ${
                          job.status === 'failed' ? 'bg-red-100' : 
                          job.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                        }`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-8" />
            </section>
          )}
          
          {/* Processes section */}
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
                  onClick={() => {
                    setActiveProcess(undefined);
                    setIsConfigModalOpen(true);
                  }}
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
                      className={itemAnimationClass}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <BatchCard 
                        process={process}
                        activeJob={getActiveJobForProcess(process.id)}
                        lastRun={getLastRunForProcess(process.id)}
                        onRunClick={runProcess}
                        onEditClick={(process) => {
                          setActiveProcess(process);
                          setIsConfigModalOpen(true);
                        }}
                        onDeleteClick={(processId) => {
                          deleteProcess(processId);
                        }}
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
                        className={`${itemAnimationClass} p-4 rounded-lg border bg-white/50 shadow-sm hover:shadow transition-all`}
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
                              onClick={() => {
                                setActiveProcess(process);
                                setIsConfigModalOpen(true);
                              }}
                            >
                              Configure
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProcess(process.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              Delete
                            </Button>
                            
                            <Button 
                              onClick={() => runProcess(process.id)}
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
          
          {/* Test run history section */}
          {testRuns.length > 0 && (
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
                        .map((run, index) => {
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
          )}
        </div>
      </main>
      
      {/* Config modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setActiveProcess(undefined);
        }}
        process={activeProcess}
        onSave={handleSaveProcess}
      />
    </div>
  );
};

export default Index;
