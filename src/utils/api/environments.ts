
import { Environment } from "@/contexts/EnvironmentContext";
import { toast } from "sonner";

const API_BASE_URL = "/api";
const ENVIRONMENTS_ENDPOINT = `${API_BASE_URL}/environments`;

// For demo purposes, we'll simulate API calls with local storage
// In a real application, these would be actual API calls

// Get all environments
export const fetchEnvironments = async (): Promise<Environment[]> => {
  try {
    // In a real app:
    // const response = await fetch(ENVIRONMENTS_ENDPOINT);
    // if (!response.ok) throw new Error('Failed to fetch environments');
    // return await response.json();
    
    // Simulated API call
    const savedEnvironments = localStorage.getItem("batchConnector.environments");
    return savedEnvironments ? JSON.parse(savedEnvironments) : [];
  } catch (error) {
    console.error("Error fetching environments:", error);
    toast.error("Failed to load environments");
    return [];
  }
};

// Get a single environment
export const fetchEnvironment = async (id: string): Promise<Environment | null> => {
  try {
    // In a real app:
    // const response = await fetch(`${ENVIRONMENTS_ENDPOINT}/${id}`);
    // if (!response.ok) throw new Error('Failed to fetch environment');
    // return await response.json();
    
    // Simulated API call
    const savedEnvironments = localStorage.getItem("batchConnector.environments");
    const environments = savedEnvironments ? JSON.parse(savedEnvironments) : [];
    
    // Helper function to find environment by ID
    const findEnv = (items: Environment[], targetId: string): Environment | null => {
      for (const env of items) {
        if (env.id === targetId) return env;
        if (env.children && env.children.length > 0) {
          const found = findEnv(env.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findEnv(environments, id);
  } catch (error) {
    console.error(`Error fetching environment ${id}:`, error);
    toast.error("Failed to load environment details");
    return null;
  }
};

// Create a new environment
export const createEnvironment = async (environment: Omit<Environment, "id">): Promise<Environment> => {
  try {
    // In a real app:
    // const response = await fetch(ENVIRONMENTS_ENDPOINT, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(environment)
    // });
    // if (!response.ok) throw new Error('Failed to create environment');
    // return await response.json();
    
    // Simulated API call
    const newEnvironment = {
      ...environment,
      id: crypto.randomUUID()
    };
    
    const savedEnvironments = localStorage.getItem("batchConnector.environments");
    const environments = savedEnvironments ? JSON.parse(savedEnvironments) : [];
    
    const updatedEnvironments = [...environments, newEnvironment];
    localStorage.setItem("batchConnector.environments", JSON.stringify(updatedEnvironments));
    
    return newEnvironment;
  } catch (error) {
    console.error("Error creating environment:", error);
    toast.error("Failed to create environment");
    throw error;
  }
};

// Update an environment
export const updateEnvironment = async (id: string, updates: Partial<Environment>): Promise<Environment> => {
  try {
    // In a real app:
    // const response = await fetch(`${ENVIRONMENTS_ENDPOINT}/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates)
    // });
    // if (!response.ok) throw new Error('Failed to update environment');
    // return await response.json();
    
    // Simulated API call
    const savedEnvironments = localStorage.getItem("batchConnector.environments");
    let environments = savedEnvironments ? JSON.parse(savedEnvironments) : [];
    
    // Helper function to update environment in the tree
    const updateEnvInTree = (items: Environment[], targetId: string, updates: Partial<Environment>): Environment[] => {
      return items.map(env => {
        if (env.id === targetId) {
          return { ...env, ...updates };
        }
        
        if (env.children && env.children.length > 0) {
          return {
            ...env,
            children: updateEnvInTree(env.children, targetId, updates)
          };
        }
        
        return env;
      });
    };
    
    environments = updateEnvInTree(environments, id, updates);
    localStorage.setItem("batchConnector.environments", JSON.stringify(environments));
    
    // Find the updated environment to return
    const findUpdated = (items: Environment[], targetId: string): Environment | null => {
      for (const env of items) {
        if (env.id === targetId) return env;
        if (env.children && env.children.length > 0) {
          const found = findUpdated(env.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    
    const updated = findUpdated(environments, id);
    if (!updated) throw new Error(`Environment with ID ${id} not found`);
    
    return updated;
  } catch (error) {
    console.error(`Error updating environment ${id}:`, error);
    toast.error("Failed to update environment");
    throw error;
  }
};

// Delete an environment
export const deleteEnvironment = async (id: string): Promise<void> => {
  try {
    // In a real app:
    // const response = await fetch(`${ENVIRONMENTS_ENDPOINT}/${id}`, {
    //   method: 'DELETE'
    // });
    // if (!response.ok) throw new Error('Failed to delete environment');
    
    // Simulated API call
    const savedEnvironments = localStorage.getItem("batchConnector.environments");
    let environments = savedEnvironments ? JSON.parse(savedEnvironments) : [];
    
    // Helper function to remove environment from the tree
    const removeEnvFromTree = (items: Environment[], targetId: string): Environment[] => {
      // Filter out the environment at the current level
      const filtered = items.filter(env => env.id !== targetId);
      
      // Also check and update children
      return filtered.map(env => {
        if (env.children && env.children.length > 0) {
          return {
            ...env,
            children: removeEnvFromTree(env.children, targetId)
          };
        }
        return env;
      });
    };
    
    environments = removeEnvFromTree(environments, id);
    localStorage.setItem("batchConnector.environments", JSON.stringify(environments));
  } catch (error) {
    console.error(`Error deleting environment ${id}:`, error);
    toast.error("Failed to delete environment");
    throw error;
  }
};
