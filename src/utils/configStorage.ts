
import { ProcessConfig } from "@/types";
import { toast } from "sonner";

// Base path for storing process configurations
const CONFIG_STORAGE_KEY = 'batchConnector.processes';

// Function to load all process configs from localStorage
export const loadProcessConfigs = (): ProcessConfig[] => {
  try {
    const savedData = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [];
  } catch (error) {
    console.error('Error loading process configs:', error);
    toast.error('Failed to load process configurations');
    return [];
  }
};

// Function to save a single process config
export const saveProcessConfig = (process: ProcessConfig): void => {
  try {
    const currentConfigs = loadProcessConfigs();
    const configIndex = currentConfigs.findIndex(c => c.id === process.id);
    
    if (configIndex >= 0) {
      // Update existing config
      currentConfigs[configIndex] = process;
    } else {
      // Add new config
      currentConfigs.push(process);
    }
    
    // Save back to localStorage
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(currentConfigs));
    
    // Export to JSON file for download
    exportConfigToFile(currentConfigs);
  } catch (error) {
    console.error('Error saving process config:', error);
    toast.error('Failed to save process configuration');
  }
};

// Function to delete a process config
export const deleteProcessConfig = (processId: string): void => {
  try {
    const currentConfigs = loadProcessConfigs();
    const updatedConfigs = currentConfigs.filter(c => c.id !== processId);
    
    if (currentConfigs.length === updatedConfigs.length) {
      toast.error('Process not found');
      return;
    }
    
    // Save back to localStorage
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updatedConfigs));
    
    // Export to JSON file for download
    exportConfigToFile(updatedConfigs);
    
    toast.success('Process deleted successfully');
  } catch (error) {
    console.error('Error deleting process config:', error);
    toast.error('Failed to delete process configuration');
  }
};

// Function to export configurations to a JSON file
const exportConfigToFile = (configs: ProcessConfig[]): void => {
  try {
    const configJson = JSON.stringify(configs, null, 2);
    const blob = new Blob([configJson], { type: "application/json" });
    
    // Create a "config" folder in localStorage to simulate file system
    localStorage.setItem('batchConnector.configFolder', 'created');
    localStorage.setItem('batchConnector.configFile', configJson);
    
    console.log('Saved configurations to simulated JSON file');
  } catch (error) {
    console.error('Error exporting config to file:', error);
  }
};

// Function to import configurations from a JSON file
export const importConfigFromFile = (jsonContent: string): ProcessConfig[] => {
  try {
    const configs = JSON.parse(jsonContent) as ProcessConfig[];
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configs));
    exportConfigToFile(configs);
    return configs;
  } catch (error) {
    console.error('Error importing config from file:', error);
    toast.error('Failed to import configurations: Invalid JSON format');
    return [];
  }
};
