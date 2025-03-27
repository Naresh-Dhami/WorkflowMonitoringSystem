
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog";
import { ProcessConfig } from "@/types";
import { Mail } from "lucide-react";
import { toast } from "sonner";

interface BatchRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  processes: ProcessConfig[];
  onRunBatch: (processIds: string[], emailReport?: string) => Promise<any>;
  isRunning: boolean;
  batchProgress: number;
}

const BatchRunnerModal = ({
  isOpen,
  onClose,
  processes,
  onRunBatch,
  isRunning,
  batchProgress
}: BatchRunnerModalProps) => {
  const [selectedProcessIds, setSelectedProcessIds] = useState<string[]>([]);
  const [emailReport, setEmailReport] = useState("");
  const [sendReport, setSendReport] = useState(false);
  
  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedProcessIds([]);
      setEmailReport("");
      setSendReport(false);
    }
  }, [isOpen]);
  
  const handleCheckboxChange = (processId: string, checked: boolean) => {
    if (checked) {
      setSelectedProcessIds(prev => [...prev, processId]);
    } else {
      setSelectedProcessIds(prev => prev.filter(id => id !== processId));
    }
  };
  
  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedProcessIds(processes.map(p => p.id));
    } else {
      setSelectedProcessIds([]);
    }
  };
  
  const handleRunBatch = async () => {
    if (selectedProcessIds.length === 0) {
      toast.warning("Please select at least one process");
      return;
    }
    
    if (sendReport && (!emailReport || !emailReport.includes('@'))) {
      toast.warning("Please enter a valid email address for the report");
      return;
    }
    
    try {
      await onRunBatch(
        selectedProcessIds, 
        sendReport ? emailReport : undefined
      );
      // Modal will be closed by the parent when batch is complete
    } catch (error) {
      console.error("Error running batch:", error);
      toast.error(`Failed to run batch: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={isRunning ? undefined : onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Run Multiple Processes</DialogTitle>
          <DialogDescription>
            Select the processes you want to run in sequence.
            {processes.length > 20 && " (Maximum 20 processes can be selected)"}
          </DialogDescription>
        </DialogHeader>
        
        {isRunning ? (
          <div className="space-y-4 py-4">
            <div className="text-center mb-4">
              <h3 className="font-medium">Running Batch Processes</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while the processes are executed...
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(batchProgress)}%</span>
              </div>
              <Progress value={batchProgress} className="h-2" />
            </div>
          </div>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              <div className="flex items-center space-x-2 p-2 border-b">
                <Checkbox 
                  id="select-all"
                  checked={selectedProcessIds.length === processes.length}
                  onCheckedChange={(checked) => handleToggleAll(checked === true)}
                />
                <Label htmlFor="select-all" className="font-medium cursor-pointer">
                  Select All Processes
                </Label>
              </div>
              
              {processes.map(process => (
                <div key={process.id} className="flex items-center space-x-2 p-2 hover:bg-muted/20">
                  <Checkbox 
                    id={`process-${process.id}`} 
                    checked={selectedProcessIds.includes(process.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(process.id, checked === true)}
                  />
                  <Label htmlFor={`process-${process.id}`} className="cursor-pointer">
                    {process.name}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="send-report" 
                  checked={sendReport}
                  onCheckedChange={(checked) => setSendReport(checked === true)}
                />
                <Label htmlFor="send-report">Send email report when complete</Label>
              </div>
              
              {sendReport && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="Email address"
                    value={emailReport}
                    onChange={(e) => setEmailReport(e.target.value)}
                  />
                </div>
              )}
            </div>
          </>
        )}
        
        <DialogFooter>
          {isRunning ? (
            <Button disabled>Running...</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button 
                onClick={handleRunBatch}
                disabled={selectedProcessIds.length === 0}
              >
                Run {selectedProcessIds.length} Processes
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchRunnerModal;
