
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
import { AmpsMessage } from "./ampsData";
import { TopicDetail } from "../gridgain/TopicDetailsTable";

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

  // Check if this message has topic details attached
  const hasTopic = message && 'topicDetail' in message && message.topicDetail;
  const topicDetail = hasTopic ? message.topicDetail as unknown as TopicDetail : null;

  // Check if this is a server details message from GridGain API
  const isServerDetails = message.type === "DC AMPS" && message.data && 'serverName' in message.data;
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center justify-between">
              {isServerDetails ? "DC AMPS Details" : topicDetail ? "Topic Detail" : "Message Details"}
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription>
              {isServerDetails && message.data 
                ? `DC ${message.data.serverName}`
                : topicDetail 
                  ? `Topic ${topicDetail.topic}` 
                  : message 
                    ? `Workflow ${message.workflowId}`
                    : ''}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8">
            <div className="space-y-4">
              {isServerDetails && message.data ? (
                // DC AMPS Server Details View
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">DC Name</h3>
                      <p className="text-sm">{message.data.serverName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Host ID</h3>
                      <p className="text-sm">{message.workflowId}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">URI</h3>
                      <p className="text-sm">{message.data.url}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Status</h3>
                      <p className="text-sm">{message.status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Environment</h3>
                      <p className="text-sm">{message.environment || environmentName}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Connection Details</h3>
                    <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-80 whitespace-pre-wrap">
                      {`DC: ${message.data.serverName}
Host: ${message.workflowId}
URI: ${message.data.url}
Connection Status: ${message.status}
Environment: ${message.environment || environmentName}
Last Updated: ${new Date(message.timestamp).toLocaleString()}`}
                    </pre>
                  </div>
                </>
              ) : topicDetail ? (
                // Topic Details View
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Topic</h3>
                      <p className="text-sm">{topicDetail.topic}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Partition</h3>
                      <p className="text-sm">{topicDetail.partition}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Offset</h3>
                      <p className="text-sm">{topicDetail.offset}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Status</h3>
                      <p className="text-sm">{topicDetail.status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Timestamp</h3>
                      <p className="text-sm">{new Date(topicDetail.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Related Workflow</h3>
                      <p className="text-sm">{message.workflowId}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Message Payload</h3>
                    <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-80 whitespace-pre-wrap">
                      {JSON.stringify({
                        topic: topicDetail.topic,
                        partition: topicDetail.partition,
                        offset: topicDetail.offset,
                        timestamp: topicDetail.timestamp,
                        key: `key-${topicDetail.id}`,
                        value: {
                          messageId: `msg-${topicDetail.id}`,
                          correlationId: message.workflowId,
                          payload: `Sample payload for topic ${topicDetail.topic}`
                        }
                      }, null, 2)}
                    </pre>
                  </div>
                </>
              ) : (
                // Message Details View (original workflow view)
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MessageDetailsDrawer;
