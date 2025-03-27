
import { BatchJob } from "@/types";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";

interface ActiveJobsSectionProps {
  activeJobs: BatchJob[];
}

const ActiveJobsSection = ({ activeJobs }: ActiveJobsSectionProps) => {
  if (activeJobs.length === 0) {
    return null;
  }
  
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Active Jobs</h2>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {activeJobs.length} running
          </span>
        </div>
      </div>
      
      <div className="grid gap-4">
        {activeJobs.map(job => (
          <div 
            key={job.id} 
            className="animate-slide-up p-4 rounded-lg border bg-white/50 backdrop-blur-sm shadow-sm"
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <h3 className="font-medium">{job.name}</h3>
                <StatusBadge status={job.status} className="ml-2" />
              </div>
              <span className="text-sm text-muted-foreground">
                Started at {new Date(job.startTime || 0).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="space-y-1 mb-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(job.progress)}%</span>
              </div>
              <Progress 
                value={job.progress} 
                className={`h-1.5 ${
                  job.status === 'failed' ? 'bg-red-100' : 
                  job.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                }`} 
              />
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="my-8" />
    </section>
  );
};

export default ActiveJobsSection;
