
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { PlusIcon, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import EnvironmentModal from "../EnvironmentModal";

interface HeaderSettingsMenuProps {
  onNewProcess: () => void;
  onAddNavItem: () => void;
  onManageNavItems: () => void;
  onImportNavigation: () => void;
  onExportNavigation: () => void;
}

const HeaderSettingsMenu = ({
  onNewProcess,
  onAddNavItem,
  onManageNavItems,
  onImportNavigation,
  onExportNavigation
}: HeaderSettingsMenuProps) => {
  const { importEnvironments, exportEnvironments, addEnvironment } = useEnvironment();
  const [showEnvModal, setShowEnvModal] = useState(false);

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

  // Handle adding a new environment
  const handleSaveEnvironment = (envData: { 
    name: string; 
    baseUrl: string; 
    description: string; 
    gridGainUrl?: string;
    ampsUrl?: string;
  }) => {
    const newEnvironment = {
      id: uuidv4(),
      ...envData
    };
    
    addEnvironment(newEnvironment);
    setShowEnvModal(false);
    toast.success(`Environment "${envData.name}" added successfully`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 border-yellow-300/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white z-[200]">
          {/* Add Process Button */}
          <DropdownMenuItem onClick={onNewProcess}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Process
          </DropdownMenuItem>
          {/* Add Environment Button */}
          <DropdownMenuItem onClick={() => setShowEnvModal(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Environment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddNavItem}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Navigation Item
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onManageNavItems}>
            <Settings className="mr-2 h-4 w-4" />
            Manage Navigation Items
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onImportNavigation}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Import Navigation
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportNavigation}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Export Navigation
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportEnvironments}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Import Environments
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportEnvironments}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Export Environments
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Environment Modal */}
      {showEnvModal && (
        <EnvironmentModal 
          isOpen={showEnvModal}
          onClose={() => setShowEnvModal(false)}
          onSave={handleSaveEnvironment}
        />
      )}
    </>
  );
};

export default HeaderSettingsMenu;
