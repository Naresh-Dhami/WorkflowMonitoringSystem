
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Import, Export, Plus } from "lucide-react";
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
  const { environments, updateEnvironment, removeEnvironment, importEnvironments, exportEnvironments, addEnvironment } = useEnvironment();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null);
  const { handleDialogClose } = useNavigationDialog();
  
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
      removeEnvironment(selectedEnvironment.id);
      toast.success(`Environment "${selectedEnvironment.name}" deleted successfully`);
      setDeleteAlertOpen(false);
      setSelectedEnvironment(null);
    }
  };

  const handleAddEnvironment = () => {
    setAddModalOpen(true);
  };

  const handleSaveNewEnvironment = (envData: {
    name: string;
    baseUrl: string;
    description: string;
    gridGainUrl?: string;
    ampsUrl?: string;
  }) => {
    const newEnvironment = {
      id: crypto.randomUUID(),
      ...envData
    };
    addEnvironment(newEnvironment);
    setAddModalOpen(false);
    toast.success(`Environment "${envData.name}" added successfully`);
    handleDialogClose();
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

  const handleImportEnvironments = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          importEnvironments(content);
          toast.success('Environments imported successfully');
        } catch (error) {
          console.error('Failed to import environments:', error);
          toast.error('Failed to import environments');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExportEnvironments = () => {
    exportEnvironments();
    toast.success('Environments exported successfully');
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
          <div className="flex justify-between items-center my-4">
            <Button onClick={handleAddEnvironment}>
              <Plus className="mr-2 h-4 w-4" />
              Add Environment
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleImportEnvironments}>
                <Import className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" onClick={handleExportEnvironments}>
                <Export className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
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
                {flattenedEnvironments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No environments found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  flattenedEnvironments.map((env) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {addModalOpen && (
        <EnvironmentModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleSaveNewEnvironment}
          mode="create"
        />
      )}

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
