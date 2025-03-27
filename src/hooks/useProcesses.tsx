
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ProcessConfig } from "@/types";
import { loadProcessConfigs, saveProcessConfig, deleteProcessConfig } from "@/utils/configStorage";

export function useProcesses() {
  // State for processes (API configurations)
  const [processes, setProcesses] = useState<ProcessConfig[]>(() => {
    // Load from localStorage/JSON file if available
    const savedProcesses = loadProcessConfigs();
    return savedProcesses.length > 0 ? savedProcesses : [];
  });
  
  // Function to add a new process
  const addProcess = useCallback((process: ProcessConfig) => {
    setProcesses(prev => [...prev, process]);
    saveProcessConfig(process);
    toast.success(`Process "${process.name}" added successfully`);
  }, []);
  
  // Function to update an existing process
  const updateProcess = useCallback((updatedProcess: ProcessConfig) => {
    setProcesses(prev => 
      prev.map(w => w.id === updatedProcess.id ? updatedProcess : w)
    );
    saveProcessConfig(updatedProcess);
    toast.success(`Process "${updatedProcess.name}" updated successfully`);
  }, []);
  
  // Function to delete a process
  const deleteProcess = useCallback((processId: string) => {
    setProcesses(prev => prev.filter(p => p.id !== processId));
    deleteProcessConfig(processId);
  }, []);
  
  return {
    processes,
    addProcess,
    updateProcess,
    deleteProcess
  };
}
