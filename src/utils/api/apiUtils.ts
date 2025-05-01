
import { toast } from "sonner";

// Helper function for handling API responses
export const handleApiResponse = async <T,>(
  response: Response, 
  successMessage?: string
): Promise<T> => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API error: ${response.status}`);
  }
  
  if (successMessage) {
    toast.success(successMessage);
  }
  
  return await response.json();
};

// Helper function for making API calls with consistent error handling
export const callApi = async <T,>(
  endpoint: string, 
  method: string = "GET", 
  body?: any, 
  successMessage?: string
): Promise<T> => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(endpoint, options);
    return await handleApiResponse<T>(response, successMessage);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    toast.error(`API Error: ${errorMessage}`);
    throw error;
  }
};

// Mock API call for testing purposes - simulates a delay and returns mock data
export const mockApiCall = <T,>(
  data: T, 
  delay: number = 300, 
  successRate: number = 0.9
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < successRate) {
        resolve(data);
      } else {
        reject(new Error("Random mock API failure"));
      }
    }, delay);
  });
};

// Helper function for localStorage operations with proper error handling
export const localStorageOps = {
  get: <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error retrieving ${key} from localStorage:`, e);
      return defaultValue;
    }
  },
  set: <T,>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage:`, e);
      toast.error("Failed to save data to local storage");
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing ${key} from localStorage:`, e);
    }
  }
};
