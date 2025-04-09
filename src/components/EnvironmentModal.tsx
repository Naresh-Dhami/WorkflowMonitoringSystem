
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigationDialog } from "@/hooks/useNavigationDialog";
import { Environment } from "@/contexts/EnvironmentContext";

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
  const [description, setDescription] = useState("");
  const [gridGainUrl, setGridGainUrl] = useState("");
  const [ampsUrl, setAmpsUrl] = useState("");
  const { handleDialogClose } = useNavigationDialog();

  // Populate form with existing environment data when editing
  useEffect(() => {
    if (mode === 'edit' && environment) {
      setName(environment.name || "");
      setBaseUrl(environment.baseUrl || "");
      setDescription(environment.description || "");
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
      description,
      gridGainUrl: gridGainUrl.trim() || undefined,
      ampsUrl: ampsUrl.trim() || undefined,
    });

    // Reset form
    setName("");
    setBaseUrl("");
    setDescription("");
    setGridGainUrl("");
    setAmpsUrl("");
    
    // Fix any stuck modal issues
    handleDialogClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setName("");
    setBaseUrl("");
    setDescription("");
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
  const description = mode === 'create' 
    ? 'Create a new environment for your batch processing.'
    : 'Update environment configuration.';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] z-[200]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="env-name" className="text-right">
                Name
              </Label>
              <Input
                id="env-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Production"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="env-url" className="text-right">
                Base URL
              </Label>
              <Input
                id="env-url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://api.example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gridgain-url" className="text-right">
                GridGain URL
              </Label>
              <Input
                id="gridgain-url"
                value={gridGainUrl}
                onChange={(e) => setGridGainUrl(e.target.value)}
                className="col-span-3"
                placeholder="http://localhost:8095/api/gridgain"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amps-url" className="text-right">
                AMPS URL
              </Label>
              <Input
                id="amps-url"
                value={ampsUrl}
                onChange={(e) => setAmpsUrl(e.target.value)}
                className="col-span-3"
                placeholder="http://localhost:8095/api/amps"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="env-description" className="text-right">
                Description
              </Label>
              <Input
                id="env-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Production environment"
              />
            </div>
          </div>
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
