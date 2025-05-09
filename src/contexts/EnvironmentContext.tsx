
import React, { createContext, useState, useContext, useEffect } from "react";
import environmentsConfig from "@/config/environments.json";

export interface Environment {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  gridGainUrl?: string;
  ampsUrl?: string;
  children?: Environment[];
}

interface EnvironmentContextType {
  environments: Environment[];
  currentEnvironment: Environment;
  setEnvironment: (environmentId: string) => void;
  importEnvironments: (jsonString: string) => void;
  exportEnvironments: () => void;
  addEnvironment: (environment: Environment) => void;
  updateEnvironment: (id: string, environment: Partial<Environment>) => void;
  removeEnvironment: (id: string) => void;
}

const defaultEnvironment = environmentsConfig.environments[0];

const EnvironmentContext = createContext<EnvironmentContextType>({
  environments: environmentsConfig.environments,
  currentEnvironment: defaultEnvironment,
  setEnvironment: () => {},
  importEnvironments: () => {},
  exportEnvironments: () => {},
  addEnvironment: () => {},
  updateEnvironment: () => {},
  removeEnvironment: () => {},
});

export const useEnvironment = () => useContext(EnvironmentContext);

// Helper function to find an environment by ID in nested structure
const findEnvironmentById = (environments: Environment[], id: string): Environment | undefined => {
  for (const env of environments) {
    if (env.id === id) return env;
    if (env.children && env.children.length > 0) {
      const found = findEnvironmentById(env.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

// Helper function to flatten nested environments for export
const flattenEnvironments = (environments: Environment[]): Environment[] => {
  const result: Environment[] = [];
  
  const flatten = (envs: Environment[]) => {
    for (const env of envs) {
      // Create a copy without children
      const { children, ...envWithoutChildren } = env;
      result.push(envWithoutChildren);
      
      if (children && children.length > 0) {
        flatten(children);
      }
    }
  };
  
  flatten(environments);
  return result;
};

// Helper function to update an environment in a nested structure
const updateEnvironmentInList = (
  environments: Environment[], 
  id: string, 
  updates: Partial<Environment>
): Environment[] => {
  return environments.map(env => {
    if (env.id === id) {
      return { ...env, ...updates };
    }
    
    if (env.children && env.children.length > 0) {
      return {
        ...env,
        children: updateEnvironmentInList(env.children, id, updates)
      };
    }
    
    return env;
  });
};

// Helper function to remove an environment by ID
const removeEnvironmentFromList = (
  environments: Environment[],
  id: string
): Environment[] => {
  // Filter out the environment with the matching ID at the current level
  const filtered = environments.filter(env => env.id !== id);
  
  // Also check child environments
  return filtered.map(env => {
    if (env.children && env.children.length > 0) {
      return {
        ...env,
        children: removeEnvironmentFromList(env.children, id)
      };
    }
    return env;
  });
};

export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [environments, setEnvironments] = useState<Environment[]>(() => {
    // Try to get the saved environments from localStorage
    const savedEnvironments = localStorage.getItem("batchConnector.environments");
    if (savedEnvironments) {
      try {
        return JSON.parse(savedEnvironments);
      } catch (e) {
        console.error("Failed to parse saved environments", e);
        return environmentsConfig.environments;
      }
    }
    return environmentsConfig.environments;
  });

  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>(() => {
    // Try to get the saved environment from localStorage
    const savedEnvironmentId = localStorage.getItem("batchConnector.environment");
    if (savedEnvironmentId) {
      const savedEnv = findEnvironmentById(environments, savedEnvironmentId);
      return savedEnv || defaultEnvironment;
    }
    return defaultEnvironment;
  });

  // Save environments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("batchConnector.environments", JSON.stringify(environments));
  }, [environments]);

  const setEnvironment = (environmentId: string) => {
    const env = findEnvironmentById(environments, environmentId);
    if (env) {
      setCurrentEnvironment(env);
      localStorage.setItem("batchConnector.environment", env.id);
    }
  };

  const addEnvironment = (environment: Environment) => {
    setEnvironments(prev => [...prev, environment]);
  };

  const updateEnvironment = (id: string, updates: Partial<Environment>) => {
    const updatedEnvironments = updateEnvironmentInList(environments, id, updates);
    setEnvironments(updatedEnvironments);
    
    // If the current environment is being updated, update it as well
    if (currentEnvironment.id === id) {
      setCurrentEnvironment(prev => ({ ...prev, ...updates }));
    }
  };

  const removeEnvironment = (id: string) => {
    // Remove the environment from the list
    const updatedEnvironments = removeEnvironmentFromList(environments, id);
    setEnvironments(updatedEnvironments);
    
    // If the current environment is being removed, reset to the first one
    if (currentEnvironment.id === id && updatedEnvironments.length > 0) {
      setCurrentEnvironment(updatedEnvironments[0]);
      localStorage.setItem("batchConnector.environment", updatedEnvironments[0].id);
    }
  };

  const importEnvironments = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Basic validation: ensure it's an array and each item has the required fields
      if (Array.isArray(parsed) && parsed.every(item => 
        typeof item.id === 'string' && 
        typeof item.name === 'string' && 
        typeof item.baseUrl === 'string' && 
        typeof item.description === 'string'
      )) {
        // Save the new environments
        setEnvironments(parsed);
        
        // If current environment doesn't exist in the new list, reset to first environment
        if (!findEnvironmentById(parsed, currentEnvironment.id)) {
          setCurrentEnvironment(parsed[0]);
          localStorage.setItem("batchConnector.environment", parsed[0].id);
        }
        
        return true;
      } else {
        throw new Error("Invalid environment format");
      }
    } catch (error) {
      console.error("Failed to import environments:", error);
      return false;
    }
  };

  const exportEnvironments = () => {
    // Flatten the environments structure for export
    const flattenedEnvironments = flattenEnvironments(environments);
    const json = JSON.stringify(flattenedEnvironments, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "batch-environments.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <EnvironmentContext.Provider
      value={{
        environments,
        currentEnvironment,
        setEnvironment,
        importEnvironments,
        exportEnvironments,
        addEnvironment,
        updateEnvironment,
        removeEnvironment,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};
