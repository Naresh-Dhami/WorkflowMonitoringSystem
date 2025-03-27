
import { useState, useEffect } from "react";
import { TestRun } from "@/types";

export function useTestRuns() {
  // State for test runs
  const [testRuns, setTestRuns] = useState<TestRun[]>(() => {
    const savedRuns = localStorage.getItem('batchConnector.testRuns');
    return savedRuns ? JSON.parse(savedRuns) : [];
  });
  
  // Save test runs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('batchConnector.testRuns', JSON.stringify(testRuns));
  }, [testRuns]);
  
  // Add a new test run
  const addTestRun = (testRun: TestRun) => {
    setTestRuns(prev => [...prev, testRun]);
  };
  
  return {
    testRuns,
    addTestRun
  };
}
