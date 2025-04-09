
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useEnvironment, Environment } from "@/contexts/EnvironmentContext";
import EnvironmentModal from "./EnvironmentModal";
import { useNavigationDialog } from "@/hooks/useNavigationDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ManageEnvironmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageEnvironmentsModal: React.FC<ManageEnvironmentsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { environments, updateEnvironment } = useEnvironment();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null);
  const { handleDialogClose } = useNavigationDialog();
  
  // Flatten environments for display
  const flattenedEnvironments = React.useMemo(() => {
    const result: Environment[] = [];
    
    const flatten = (envs: Environment[]) => {
      for (const env of envs) {
        result.push(env);
        
        if (env.children && env.children.length > 0) {
          flatten(env.children);
        }
      }
    };
    
    flatten(environments);
    return result;
  }, [environments]);

  const handleClose = () => {
    onClose();
    handleDialogClose();
  };

  const handleEdit = (env: Environment) => {
    setSelectedEnvironment(env);
    setEditModalOpen(true);
  };

  const handleDelete = (env: Environment) => {
    setSelectedEnvironment(env);
    setDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEnvironment) {
      // In a real implementation, we would call a delete function in the context
      toast.error("Environment deletion not implemented yet");
      setDeleteAlertOpen(false);
      setSelectedEnvironment(null);
    }
  };

  const handleSaveEnvironment = (updatedEnv: {
    name: string;
    baseUrl: string;
    description: string;
    gridGainUrl?: string;
    ampsUrl?: string;
  }) => {
    if (selectedEnvironment) {
      updateEnvironment(selectedEnvironment.id, updatedEnv);
      toast.success(`Environment "${updatedEnv.name}" updated successfully`);
      setEditModalOpen(false);
      setSelectedEnvironment(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl z-[200]">
          <DialogHeader>
            <DialogTitle>Manage Environments</DialogTitle>
            <DialogDescription>
              View and edit your environments for batch processing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Base URL</TableHead>
                  <TableHead>GridGain URL</TableHead>
                  <TableHead>AMPS URL</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flattenedEnvironments.map((env) => (
                  <TableRow key={env.id}>
                    <TableCell className="font-medium">{env.name}</TableCell>
                    <TableCell className="max-w-[150px] truncate" title={env.baseUrl}>
                      {env.baseUrl}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={env.gridGainUrl}>
                      {env.gridGainUrl || "-"}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={env.ampsUrl}>
                      {env.ampsUrl || "-"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={env.description}>
                      {env.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(env)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(env)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {editModalOpen && selectedEnvironment && (
        <EnvironmentModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedEnvironment(null);
          }}
          onSave={handleSaveEnvironment}
          environment={selectedEnvironment}
          mode="edit"
        />
      )}

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the environment "{selectedEnvironment?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ManageEnvironmentsModal;
