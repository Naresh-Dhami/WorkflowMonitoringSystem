
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AmpsMessage } from "./MessagesTable";

interface MessageDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: AmpsMessage | null;
  environmentName: string;
}

const MessageDetailsDrawer = ({
  open,
  onOpenChange,
  message,
  environmentName
}: MessageDetailsDrawerProps) => {
  if (!message) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center justify-between">
              Message Details
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription>
              {message ? `Workflow ${message.workflowId}` : ''}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Workflow ID</h3>
                  <p className="text-sm">{message.workflowId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Type</h3>
                  <p className="text-sm">{message.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Environment</h3>
                  <p className="text-sm">{message.environment || environmentName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <p className="text-sm">{message.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Timestamp</h3>
                  <p className="text-sm">{new Date(message.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Details</h3>
                <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-80 whitespace-pre-wrap">
                  {message.details}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MessageDetailsDrawer;
