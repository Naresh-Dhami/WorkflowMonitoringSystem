
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
}

const defaultEnvironment = environmentsConfig.environments[0];

const EnvironmentContext = createContext<EnvironmentContextType>({
  environments: environmentsConfig.environments,
  currentEnvironment: defaultEnvironment,
  setEnvironment: () => {},
});

export const useEnvironment = () => useContext(EnvironmentContext);

export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>(() => {
    // Try to get the saved environment from localStorage
    const savedEnvironmentId = localStorage.getItem("batchConnector.environment");
    if (savedEnvironmentId) {
      const savedEnv = environmentsConfig.environments.find(env => env.id === savedEnvironmentId);
      return savedEnv || defaultEnvironment;
    }
    return defaultEnvironment;
  });

  const setEnvironment = (environmentId: string) => {
    const env = environmentsConfig.environments.find(env => env.id === environmentId);
    if (env) {
      setCurrentEnvironment(env);
      localStorage.setItem("batchConnector.environment", env.id);
    }
  };

  return (
    <EnvironmentContext.Provider
      value={{
        environments: environmentsConfig.environments,
        currentEnvironment,
        setEnvironment,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};
