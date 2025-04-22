
import React from "react";
import { ApiConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ArrowDown } from "lucide-react";

interface StepConfigProps {
  step: ApiConfig;
  index: number;
  totalSteps: number;
  onUpdate: (index: number, updatedStep: ApiConfig) => void;
  onDelete: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const StepConfig: React.FC<StepConfigProps> = ({
  step,
  index,
  totalSteps,
  onUpdate,
  onDelete,
  onMoveDown,
}) => {
  return (
    <div className="p-4 rounded-md border transition-all duration-200 neo hover:shadow">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Step {index + 1}</h4>
        <div className="flex space-x-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onMoveDown(index)}
            disabled={index === totalSteps - 1}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={() => onDelete(index)}
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
              onChange={(e) => onUpdate(index, { ...step, name: e.target.value })}
              placeholder="Step name"
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`step-${index}-method`} className="text-xs">Method</Label>
            <select
              id={`step-${index}-method`}
              value={step.method}
              onChange={(e) => onUpdate(index, { 
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
            onChange={(e) => onUpdate(index, { ...step, endpoint: e.target.value })}
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
                  onUpdate(index, { ...step, body });
                } catch (error) {
                  // Allow invalid JSON during typing
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
  );
};

export default StepConfig;
