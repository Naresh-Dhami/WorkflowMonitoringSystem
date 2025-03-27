
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { PlayCircle, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { BatchJob, TestRun, WorkflowConfig } from "@/types";
import { useState } from "react";

interface BatchCardProps {
  workflow: WorkflowConfig;
  activeJob?: BatchJob;
  lastRun?: TestRun;
  onRunClick: (workflowId: string) => void;
  onEditClick: (workflow: WorkflowConfig) => void;
  isLoading: boolean;
}

const BatchCard = ({ 
  workflow, 
  activeJob, 
  lastRun, 
  onRunClick, 
  onEditClick,
  isLoading 
}: BatchCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleTimeString();
  };
  
  return (
    <Card 
      className={cn(
        "card-hover overflow-hidden",
        isHovered ? "shadow-md" : "shadow-sm" 
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              {workflow.name}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {workflow.description}
            </CardDescription>
          </div>
          {(activeJob || lastRun) && (
            <StatusBadge 
              status={activeJob?.status || lastRun?.status || 'idle'} 
              className="ml-2 flex-shrink-0"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        {activeJob?.status === 'running' && (
          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(activeJob.progress)}%</span>
            </div>
            <Progress value={activeJob.progress} className="h-1" />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
          <div className="text-muted-foreground">Steps:</div>
          <div className="font-medium">{workflow.steps.length}</div>
          
          {(activeJob || lastRun) && (
            <>
              <div className="text-muted-foreground">Started:</div>
              <div className="font-medium">{formatDate(activeJob?.startTime || lastRun?.startTime)}</div>
              
              {(activeJob?.endTime || lastRun?.endTime) && (
                <>
                  <div className="text-muted-foreground">Finished:</div>
                  <div className="font-medium">{formatDate(activeJob?.endTime || lastRun?.endTime)}</div>
                </>
              )}
              
              {(activeJob?.duration || lastRun?.endTime && lastRun?.startTime) && (
                <>
                  <div className="text-muted-foreground">Duration:</div>
                  <div className="font-medium">
                    {activeJob?.duration 
                      ? formatDuration(activeJob.duration)
                      : lastRun?.endTime && lastRun?.startTime 
                        ? formatDuration((new Date(lastRun.endTime).getTime() - new Date(lastRun.startTime).getTime()) / 1000)
                        : '-'
                    }
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEditClick(workflow)}
          className="text-sm"
        >
          Configure
        </Button>
        
        <Button 
          onClick={() => onRunClick(workflow.id)}
          disabled={isLoading || activeJob?.status === 'running'}
          size="sm"
          className={cn(
            "bg-primary hover:bg-primary/90 text-white btn-animation",
            "transition-all duration-300 ease-in-out",
            isHovered ? "shadow-md" : "shadow-sm",
          )}
        >
          {activeJob?.status === 'running' ? (
            <>
              <Clock className="mr-1 h-4 w-4" />
              Running...
            </>
          ) : (
            <>
              <PlayCircle className="mr-1 h-4 w-4" />
              Run Workflow
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BatchCard;
