
import { ProcessConfig } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = "/api";
const PROCESSES_ENDPOINT = `${API_BASE_URL}/processes`;

// For demo purposes, we'll simulate API calls with local storage
// In a real application, these would be actual API calls

// Get all processes
export const fetchProcesses = async (): Promise<ProcessConfig[]> => {
  try {
    // In a real app:
    // const response = await fetch(PROCESSES_ENDPOINT);
    // if (!response.ok) throw new Error('Failed to fetch processes');
    // return await response.json();
    
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedProcesses = localStorage.getItem("batchConnector.processConfigs");
        resolve(savedProcesses ? JSON.parse(savedProcesses) : []);
      }, 300);
    });
  } catch (error) {
    console.error("Error fetching processes:", error);
    toast.error("Failed to load processes");
    return [];
  }
};

// Get a single process
export const fetchProcess = async (id: string): Promise<ProcessConfig | null> => {
  try {
    // In a real app:
    // const response = await fetch(`${PROCESSES_ENDPOINT}/${id}`);
    // if (!response.ok) throw new Error('Failed to fetch process');
    // return await response.json();
    
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedProcesses = localStorage.getItem("batchConnector.processConfigs");
        const processes = savedProcesses ? JSON.parse(savedProcesses) : [];
        const process = processes.find((p: ProcessConfig) => p.id === id);
        resolve(process || null);
      }, 300);
    });
  } catch (error) {
    console.error(`Error fetching process ${id}:`, error);
    toast.error("Failed to load process details");
    return null;
  }
};

// Create a new process
export const createProcess = async (process: Omit<ProcessConfig, "id">): Promise<ProcessConfig> => {
  try {
    // In a real app:
    // const response = await fetch(PROCESSES_ENDPOINT, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(process)
    // });
    // if (!response.ok) throw new Error('Failed to create process');
    // return await response.json();
    
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProcess = {
          ...process,
          id: uuidv4()
        };
        
        const savedProcesses = localStorage.getItem("batchConnector.processConfigs");
        const processes = savedProcesses ? JSON.parse(savedProcesses) : [];
        
        const updatedProcesses = [...processes, newProcess];
        localStorage.setItem("batchConnector.processConfigs", JSON.stringify(updatedProcesses));
        
        resolve(newProcess);
      }, 500);
    });
  } catch (error) {
    console.error("Error creating process:", error);
    toast.error("Failed to create process");
    throw error;
  }
};

// Update a process
export const updateProcess = async (id: string, process: Omit<ProcessConfig, "id">): Promise<ProcessConfig> => {
  try {
    // In a real app:
    // const response = await fetch(`${PROCESSES_ENDPOINT}/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(process)
    // });
    // if (!response.ok) throw new Error('Failed to update process');
    // return await response.json();
    
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedProcesses = localStorage.getItem("batchConnector.processConfigs");
        const processes = savedProcesses ? JSON.parse(savedProcesses) : [];
        
        const updatedProcess = { ...process, id };
        const updatedProcesses = processes.map((p: ProcessConfig) => 
          p.id === id ? updatedProcess : p
        );
        
        localStorage.setItem("batchConnector.processConfigs", JSON.stringify(updatedProcesses));
        resolve(updatedProcess);
      }, 500);
    });
  } catch (error) {
    console.error(`Error updating process ${id}:`, error);
    toast.error("Failed to update process");
    throw error;
  }
};

// Delete a process
export const deleteProcess = async (id: string): Promise<void> => {
  try {
    // In a real app:
    // const response = await fetch(`${PROCESSES_ENDPOINT}/${id}`, {
    //   method: 'DELETE'
    // });
    // if (!response.ok) throw new Error('Failed to delete process');
    
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedProcesses = localStorage.getItem("batchConnector.processConfigs");
        const processes = savedProcesses ? JSON.parse(savedProcesses) : [];
        
        const updatedProcesses = processes.filter((p: ProcessConfig) => p.id !== id);
        localStorage.setItem("batchConnector.processConfigs", JSON.stringify(updatedProcesses));
        
        resolve();
      }, 500);
    });
  } catch (error) {
    console.error(`Error deleting process ${id}:`, error);
    toast.error("Failed to delete process");
    throw error;
  }
};

// Export processes to a JSON file
export const exportProcessesApi = (processes: ProcessConfig[]): void => {
  try {
    const processesJson = JSON.stringify(processes, null, 2);
    const blob = new Blob([processesJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `processes-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error exporting processes:", error);
    throw error;
  }
};

// Import processes from a JSON file
export const importProcessesApi = (jsonData: string): ProcessConfig[] => {
  try {
    const processes = JSON.parse(jsonData) as ProcessConfig[];
    localStorage.setItem("batchConnector.processConfigs", JSON.stringify(processes));
    return processes;
  } catch (error) {
    console.error("Error importing processes:", error);
    throw new Error("Invalid JSON format");
  }
};
