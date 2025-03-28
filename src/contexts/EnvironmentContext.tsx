
import React, { createContext, useState, useContext, useEffect } from "react";
import environmentsConfig from "@/config/environments.json";

export interface Environment {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
}

interface EnvironmentContextType {
  environments: Environment[];
  currentEnvironment: Environment;
  setEnvironment: (environmentId: string) => void;
  importEnvironments: (jsonString: string) => void;
  exportEnvironments: () => void;
}

const defaultEnvironment = environmentsConfig.environments[0];

const EnvironmentContext = createContext<EnvironmentContextType>({
  environments: environmentsConfig.environments,
  currentEnvironment: defaultEnvironment,
  setEnvironment: () => {},
  importEnvironments: () => {},
  exportEnvironments: () => {},
});

export const useEnvironment = () => useContext(EnvironmentContext);

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
      const savedEnv = environments.find(env => env.id === savedEnvironmentId);
      return savedEnv || defaultEnvironment;
    }
    return defaultEnvironment;
  });

  // Save environments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("batchConnector.environments", JSON.stringify(environments));
  }, [environments]);

  const setEnvironment = (environmentId: string) => {
    const env = environments.find(env => env.id === environmentId);
    if (env) {
      setCurrentEnvironment(env);
      localStorage.setItem("batchConnector.environment", env.id);
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
        if (!parsed.find(env => env.id === currentEnvironment.id)) {
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
    const json = JSON.stringify(environments, null, 2);
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
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};
