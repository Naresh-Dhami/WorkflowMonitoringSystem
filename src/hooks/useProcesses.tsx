
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ProcessConfig } from "@/types";
import { 
  fetchProcesses, 
  createProcess, 
  updateProcess as updateProcessApi, 
  deleteProcess as deleteProcessApi,
  exportProcessesApi,
  importProcessesApi
} from "@/utils/api/processesApi";

export function useProcesses() {
  // State for processes (API configurations)
  const [processes, setProcesses] = useState<ProcessConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load processes when the hook mounts
  useEffect(() => {
    const loadProcesses = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProcesses();
        setProcesses(data);
      } catch (error) {
        console.error("Failed to load processes:", error);
        toast.error("Failed to load processes");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProcesses();
  }, []);
  
  // Function to add a new process
  const addProcess = useCallback(async (process: ProcessConfig) => {
    try {
      const newProcess = await createProcess(process);
      setProcesses(prev => [...prev, newProcess]);
      toast.success(`Process "${process.name}" added successfully`);
      return newProcess;
    } catch (error) {
      toast.error(`Failed to add process: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, []);
  
  // Function to update an existing process
  const updateProcess = useCallback(async (updatedProcess: ProcessConfig) => {
    try {
      const { id, ...processData } = updatedProcess;
      await updateProcessApi(id, processData);
      setProcesses(prev => 
        prev.map(w => w.id === updatedProcess.id ? updatedProcess : w)
      );
      toast.success(`Process "${updatedProcess.name}" updated successfully`);
      return updatedProcess;
    } catch (error) {
      toast.error(`Failed to update process: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, []);
  
  // Function to delete a process
  const deleteProcess = useCallback(async (processId: string) => {
    try {
      await deleteProcessApi(processId);
      setProcesses(prev => prev.filter(p => p.id !== processId));
      toast.success("Process deleted successfully");
    } catch (error) {
      toast.error(`Failed to delete process: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, []);
  
  // Function to export processes
  const exportProcesses = useCallback(() => {
    try {
      exportProcessesApi(processes);
    } catch (error) {
      toast.error(`Failed to export processes: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [processes]);

  // Function to import processes
  const importProcesses = useCallback((jsonData: string) => {
    try {
      const importedProcesses = importProcessesApi(jsonData);
      setProcesses(importedProcesses);
      return importedProcesses;
    } catch (error) {
      toast.error(`Failed to import processes: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, []);
  
  return {
    processes,
    isLoading,
    addProcess,
    updateProcess,
    deleteProcess,
    exportProcesses,
    importProcesses
  };
}
