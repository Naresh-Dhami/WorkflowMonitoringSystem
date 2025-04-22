
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProcessConfig } from "@/types";

interface ProcessFormProps {
  process: ProcessConfig;
  onUpdate: (updatedProcess: ProcessConfig) => void;
}

const ProcessForm: React.FC<ProcessFormProps> = ({ process, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Process Name</Label>
        <Input
          id="name"
          value={process.name}
          onChange={(e) => onUpdate({ ...process, name: e.target.value })}
          placeholder="Enter process name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={process.description}
          onChange={(e) => onUpdate({ ...process, description: e.target.value })}
          placeholder="Enter process description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="completion-endpoint">Completion Check Endpoint (Optional)</Label>
        <Input
          id="completion-endpoint"
          value={process.completionCheckEndpoint || ''}
          onChange={(e) => onUpdate({ ...process, completionCheckEndpoint: e.target.value })}
          placeholder="/api/process/status"
        />
        <p className="text-xs text-muted-foreground">
          Endpoint to check if the process has completed after all steps have run
        </p>
      </div>
    </div>
  );
};

export default ProcessForm;
