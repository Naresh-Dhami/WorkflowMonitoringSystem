
import { cn } from "@/lib/utils";
import { Status } from "@/types";
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const StatusBadge = ({ status, className, showText = true, size = "md" }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "idle":
        return {
          color: "bg-gray-100 text-gray-600 border-gray-200",
          icon: <Clock className={cn(
            "animate-pulse-subtle",
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
          )} />,
          label: "Idle"
        };
      case "running":
        return {
          color: "bg-blue-50 text-blue-600 border-blue-200",
          icon: <Loader2 className={cn(
            "animate-spin",
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
          )} />,
          label: "Running"
        };
      case "completed":
        return {
          color: "bg-green-50 text-green-600 border-green-200",
          icon: <CheckCircle className={cn(
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
          )} />,
          label: "Completed"
        };
      case "failed":
        return {
          color: "bg-red-50 text-red-600 border-red-200",
          icon: <XCircle className={cn(
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
          )} />,
          label: "Failed"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-600 border-gray-200",
          icon: <Clock className={cn(
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
          )} />,
          label: "Unknown"
        };
    }
  };

  const { color, icon, label } = getStatusConfig();

  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full border",
      color,
      size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base",
      className
    )}>
      {icon}
      {showText && <span className={size === "sm" ? "ml-1" : "ml-1.5"}>{label}</span>}
    </div>
  );
};

export default StatusBadge;
