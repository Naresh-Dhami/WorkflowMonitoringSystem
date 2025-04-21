
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigationDialog } from "@/hooks/useNavigationDialog";
import { Environment } from "@/contexts/EnvironmentContext";
import EnvironmentFormFields from "./environments/EnvironmentFormFields";

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (environment: {
    name: string;
    baseUrl: string;
    description: string;
    gridGainUrl?: string;
    ampsUrl?: string;
  }) => void;
  environment?: Environment; // Existing environment for editing
  mode?: 'create' | 'edit';
}

const EnvironmentModal: React.FC<EnvironmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  environment,
  mode = 'create'
}) => {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [gridGainUrl, setGridGainUrl] = useState("");
  const [ampsUrl, setAmpsUrl] = useState("");
  const { handleDialogClose } = useNavigationDialog();

  // Populate form with existing environment data when editing
  useEffect(() => {
    if (mode === 'edit' && environment) {
      setName(environment.name || "");
      setBaseUrl(environment.baseUrl || "");
      setDescriptionText(environment.description || "");
      setGridGainUrl(environment.gridGainUrl || "");
      setAmpsUrl(environment.ampsUrl || "");
    }
  }, [environment, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Environment name is required");
      return;
    }

    if (!baseUrl.trim()) {
      toast.error("Base URL is required");
      return;
    }

    onSave({
      name,
      baseUrl,
      description: descriptionText,
      gridGainUrl: gridGainUrl.trim() || undefined,
      ampsUrl: ampsUrl.trim() || undefined,
    });

    // Reset form
    setName("");
    setBaseUrl("");
    setDescriptionText("");
    setGridGainUrl("");
    setAmpsUrl("");
    
    // Fix any stuck modal issues
    handleDialogClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setName("");
    setBaseUrl("");
    setDescriptionText("");
    setGridGainUrl("");
    setAmpsUrl("");
    onClose();
    
    // Fix any stuck modal issues
    handleDialogClose();
  };

  // Handle dialog close when the component unmounts
  useEffect(() => {
    return () => {
      // Dispatch a custom dialog closed event
      const event = new CustomEvent('dialogClosed');
      window.dispatchEvent(event);
    };
  }, []);

  const title = mode === 'create' ? 'Add New Environment' : 'Edit Environment';
  const modalDescription = mode === 'create' 
    ? 'Create a new environment for your batch processing.'
    : 'Update environment configuration.';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] z-[200]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {modalDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <EnvironmentFormFields
            name={name}
            setName={setName}
            baseUrl={baseUrl}
            setBaseUrl={setBaseUrl}
            descriptionText={descriptionText}
            setDescriptionText={setDescriptionText}
            gridGainUrl={gridGainUrl}
            setGridGainUrl={setGridGainUrl}
            ampsUrl={ampsUrl}
            setAmpsUrl={setAmpsUrl}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnvironmentModal;
