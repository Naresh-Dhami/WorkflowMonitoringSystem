
import { useState, useRef } from "react";
import Header from "@/components/Header";
import ConfigModal from "@/components/ConfigModal";
import { useBatchJobs } from "@/hooks/useBatchJobs";
import { ProcessConfig } from "@/types";
import { toast } from "sonner";
import { importConfigFromFile } from "@/utils/configStorage";
import ProcessSection from "@/components/ProcessSection";
import ActiveJobsSection from "@/components/ActiveJobsSection";
import TestRunsSection from "@/components/TestRunsSection";

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
    setIsConfigModalOpen(false);
  };

  const openNewProcessModal = () => {
    setActiveProcess(undefined);
    setIsConfigModalOpen(true);
  };
  
  const openEditProcessModal = (process: ProcessConfig) => {
    setActiveProcess(process);
    setIsConfigModalOpen(true);
  };
  
  // Animation styles
  const containerAnimationClass = "animate-fade-in";
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        onNewProcess={openNewProcessModal}
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
          <ActiveJobsSection activeJobs={activeJobs} />
          
          <ProcessSection 
            processes={processes}
            testRuns={testRuns}
            activeJobs={activeJobs}
            isLoading={isLoading}
            onNewProcess={openNewProcessModal}
            onRunProcess={runProcess}
            onEditProcess={openEditProcessModal}
            onDeleteProcess={deleteProcess}
          />
          
          <TestRunsSection 
            testRuns={testRuns}
            processes={processes}
          />
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
