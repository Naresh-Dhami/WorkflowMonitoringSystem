
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, Plus } from "lucide-react";
import { toast } from "sonner";
import { useEnvironment, Environment } from "@/contexts/EnvironmentContext";
import EnvironmentModal from "./EnvironmentModal";
import { useNavigationDialog } from "@/hooks/useNavigationDialog";
import EnvironmentsList from "./environments/EnvironmentsList";
import DeleteConfirmationDialog from "./navigation/DeleteConfirmationDialog";

interface ManageEnvironmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageEnvironmentsModal: React.FC<ManageEnvironmentsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { environments, updateEnvironment, addEnvironment, removeEnvironment, importEnvironments, exportEnvironments } = useEnvironment();
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
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" onClick={handleExportEnvironments}>
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <EnvironmentsList
              environments={flattenedEnvironments}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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

      <DeleteConfirmationDialog
        isOpen={deleteAlertOpen}
        onClose={() => setDeleteAlertOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Environment"
        description={`This will permanently delete the environment "${selectedEnvironment?.name}". This action cannot be undone.`}
      />
    </>
  );
};

export default ManageEnvironmentsModal;
