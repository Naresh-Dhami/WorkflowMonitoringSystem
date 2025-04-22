
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Save } from "lucide-react";
import { ApiConfig, ProcessConfig } from "@/types";
import { v4 as uuidv4 } from "uuid";
import ProcessForm from "./process/ProcessForm";
import StepConfig from "./process/StepConfig";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  process?: ProcessConfig;
  onSave: (process: ProcessConfig) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, process, onSave }) => {
  const [activeProcess, setActiveProcess] = useState<ProcessConfig>({
    id: '',
    name: '',
    description: '',
    steps: [],
    completionCheckEndpoint: ''
  });
  
  const [activeTab, setActiveTab] = useState('general');
  
  useEffect(() => {
    if (process) {
      setActiveProcess({ ...process });
    } else {
      setActiveProcess({
        id: `process-${Date.now()}`,
        name: '',
        description: '',
        steps: [],
        completionCheckEndpoint: ''
      });
    }
    setActiveTab('general');
  }, [process, isOpen]);
  
  const handleSave = () => {
    onSave(activeProcess);
    onClose();
  };
  
  const addStep = () => {
    const newStep: ApiConfig = {
      id: `step-${Date.now()}`,
      name: `Step ${activeProcess.steps.length + 1}`,
      endpoint: '',
      method: 'GET'
    };
    
    setActiveProcess({
      ...activeProcess,
      steps: [...activeProcess.steps, newStep]
    });
  };
  
  const updateStep = (index: number, updatedStep: ApiConfig) => {
    const newSteps = [...activeProcess.steps];
    newSteps[index] = updatedStep;
    setActiveProcess({ ...activeProcess, steps: newSteps });
  };
  
  const removeStep = (index: number) => {
    setActiveProcess({
      ...activeProcess,
      steps: activeProcess.steps.filter((_, i) => i !== index)
    });
  };
  
  const moveStepDown = (index: number) => {
    if (index >= activeProcess.steps.length - 1) return;
    
    const newSteps = [...activeProcess.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + 1];
    newSteps[index + 1] = temp;
    
    setActiveProcess({ ...activeProcess, steps: newSteps });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {process ? 'Edit Process' : 'Create New Process'}
          </DialogTitle>
          <DialogDescription>
            Configure the process steps and settings
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="steps">
              Steps
              {activeProcess.steps.length > 0 && (
                <Badge className="ml-2 bg-primary/10 text-primary" variant="outline">
                  {activeProcess.steps.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 animate-fade-in">
            <ProcessForm process={activeProcess} onUpdate={setActiveProcess} />
          </TabsContent>
          
          <TabsContent value="steps" className="space-y-6 animate-fade-in">
            {activeProcess.steps.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No steps defined yet</p>
                <Button onClick={addStep} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Step
                </Button>
              </div>
            ) : (
              <>
                {activeProcess.steps.map((step, index) => (
                  <StepConfig
                    key={step.id}
                    step={step}
                    index={index}
                    totalSteps={activeProcess.steps.length}
                    onUpdate={updateStep}
                    onDelete={removeStep}
                    onMoveDown={moveStepDown}
                  />
                ))}
                
                <Button 
                  onClick={addStep} 
                  variant="outline" 
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Step
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!activeProcess.name || activeProcess.steps.length === 0}
            className="btn-animation"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Process
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigModal;
