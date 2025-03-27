
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save, ArrowDown } from "lucide-react";
import { ApiConfig, ProcessConfig } from "@/types";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  process?: ProcessConfig;
  onSave: (process: ProcessConfig) => void;
}

const ConfigModal = ({ isOpen, onClose, process, onSave }: ConfigModalProps) => {
  const [activeProcess, setActiveProcess] = useState<ProcessConfig>({
    id: '',
    name: '',
    description: '',
    steps: [],
    completionCheckEndpoint: ''
  });
  
  const [activeTab, setActiveTab] = useState('general');
  
  // Initialize form when modal opens or process changes
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
    
    setActiveProcess({
      ...activeProcess,
      steps: newSteps
    });
  };
  
  const removeStep = (index: number) => {
    const newSteps = activeProcess.steps.filter((_, i) => i !== index);
    
    setActiveProcess({
      ...activeProcess,
      steps: newSteps
    });
  };
  
  const moveStepDown = (index: number) => {
    if (index >= activeProcess.steps.length - 1) return;
    
    const newSteps = [...activeProcess.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + 1];
    newSteps[index + 1] = temp;
    
    setActiveProcess({
      ...activeProcess,
      steps: newSteps
    });
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
            <div className="space-y-2">
              <Label htmlFor="name">Process Name</Label>
              <Input
                id="name"
                value={activeProcess.name}
                onChange={(e) => setActiveProcess({ ...activeProcess, name: e.target.value })}
                placeholder="Enter process name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={activeProcess.description}
                onChange={(e) => setActiveProcess({ ...activeProcess, description: e.target.value })}
                placeholder="Enter process description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="completion-endpoint">Completion Check Endpoint (Optional)</Label>
              <Input
                id="completion-endpoint"
                value={activeProcess.completionCheckEndpoint || ''}
                onChange={(e) => setActiveProcess({ ...activeProcess, completionCheckEndpoint: e.target.value })}
                placeholder="/api/process/status"
              />
              <p className="text-xs text-muted-foreground">
                Endpoint to check if the process has completed after all steps have run
              </p>
            </div>
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
                  <div
                    key={step.id}
                    className={cn(
                      "p-4 rounded-md border",
                      "transition-all duration-200",
                      "neo hover:shadow"
                    )}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Step {index + 1}</h4>
                      <div className="flex space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => moveStepDown(index)}
                          disabled={index === activeProcess.steps.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => removeStep(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`step-${index}-name`} className="text-xs">Name</Label>
                          <Input
                            id={`step-${index}-name`}
                            value={step.name}
                            onChange={(e) => updateStep(index, { ...step, name: e.target.value })}
                            placeholder="Step name"
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`step-${index}-method`} className="text-xs">Method</Label>
                          <select
                            id={`step-${index}-method`}
                            value={step.method}
                            onChange={(e) => updateStep(index, { 
                              ...step, 
                              method: e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' 
                            })}
                            className="h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                          >
                            <option>GET</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>DELETE</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`step-${index}-endpoint`} className="text-xs">Endpoint</Label>
                        <Input
                          id={`step-${index}-endpoint`}
                          value={step.endpoint}
                          onChange={(e) => updateStep(index, { ...step, endpoint: e.target.value })}
                          placeholder="/api/endpoint"
                          className="h-8"
                        />
                      </div>
                      
                      {(step.method === 'POST' || step.method === 'PUT') && (
                        <div className="space-y-1">
                          <Label htmlFor={`step-${index}-body`} className="text-xs">Request Body (JSON)</Label>
                          <Textarea
                            id={`step-${index}-body`}
                            value={step.body ? JSON.stringify(step.body, null, 2) : ''}
                            onChange={(e) => {
                              try {
                                const body = e.target.value ? JSON.parse(e.target.value) : undefined;
                                updateStep(index, { ...step, body });
                              } catch (error) {
                                // Allow invalid JSON during typing
                                // It will be validated on save
                              }
                            }}
                            placeholder='{"key": "value"}'
                            rows={3}
                            className="font-mono text-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
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
