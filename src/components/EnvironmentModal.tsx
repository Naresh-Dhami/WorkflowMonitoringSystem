
import React, { useState } from "react";
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

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (environment: {
    name: string;
    baseUrl: string;
    description: string;
  }) => void;
}

const EnvironmentModal: React.FC<EnvironmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [description, setDescription] = useState("");

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
    });

    // Reset form
    setName("");
    setBaseUrl("");
    setDescription("");
  };

  const handleClose = () => {
    // Reset form when closing
    setName("");
    setBaseUrl("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] z-[200]">
        <DialogHeader>
          <DialogTitle>Add New Environment</DialogTitle>
          <DialogDescription>
            Create a new environment for your batch processing.
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
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnvironmentModal;
