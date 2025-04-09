
import { Button } from "@/components/ui/button";
import { useEnvironment, Environment } from "@/contexts/EnvironmentContext";
import { Globe, Pencil } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger, 
  DropdownMenuSub, 
  DropdownMenuSubTrigger, 
  DropdownMenuSubContent,
  DropdownMenuGroup,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";
import EnvironmentModal from "./EnvironmentModal";

const EnvironmentMenuItem = ({ 
  env, 
  onSelect, 
  onEdit 
}: { 
  env: Environment, 
  onSelect: (envId: string) => void,
  onEdit: (env: Environment) => void
}) => {
  if (env.children && env.children.length > 0) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer !text-black">
          <div className="flex flex-col">
            <span>{env.name}</span>
            <span className="text-xs text-muted-foreground">{env.baseUrl}</span>
            {env.gridGainUrl && <span className="text-xs text-muted-foreground">GridGain: {env.gridGainUrl}</span>}
            {env.ampsUrl && <span className="text-xs text-muted-foreground">AMPS: {env.ampsUrl}</span>}
          </div>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="bg-white z-[150]">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer !text-black"
              onClick={() => onSelect(env.id)}
            >
              <div className="flex flex-col">
                <span>{env.name} (Root)</span>
                <span className="text-xs text-muted-foreground">{env.baseUrl}</span>
                {env.gridGainUrl && <span className="text-xs text-muted-foreground">GridGain: {env.gridGainUrl}</span>}
                {env.ampsUrl && <span className="text-xs text-muted-foreground">AMPS: {env.ampsUrl}</span>}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer !text-black"
              onClick={() => onEdit(env)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              <span>Edit {env.name}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {env.children.map((childEnv) => (
            <EnvironmentMenuItem 
              key={childEnv.id} 
              env={childEnv} 
              onSelect={onSelect} 
              onEdit={onEdit} 
            />
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem
        className="cursor-pointer !text-black"
        onClick={() => onSelect(env.id)}
      >
        <div className="flex flex-col w-full">
          <span>{env.name}</span>
          <span className="text-xs text-muted-foreground">{env.baseUrl}</span>
          {env.gridGainUrl && <span className="text-xs text-muted-foreground">GridGain: {env.gridGainUrl}</span>}
          {env.ampsUrl && <span className="text-xs text-muted-foreground">AMPS: {env.ampsUrl}</span>}
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer !text-black"
        onClick={() => onEdit(env)}
      >
        <Pencil className="w-4 h-4 mr-2" />
        <span>Edit {env.name}</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
};

const EnvironmentSelector = () => {
  const { environments, currentEnvironment, setEnvironment, updateEnvironment } = useEnvironment();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [environmentToEdit, setEnvironmentToEdit] = useState<Environment | undefined>(undefined);

  const handleEnvironmentChange = (envId: string) => {
    setEnvironment(envId);
    toast.success(`Environment switched to ${environments.find(e => e.id === envId)?.name || 'new environment'}`);
  };

  const handleEditEnvironment = (env: Environment) => {
    setEnvironmentToEdit(env);
    setEditModalOpen(true);
  };

  const handleSaveEnvironment = (updatedEnv: {
    name: string;
    baseUrl: string;
    description: string;
    gridGainUrl?: string;
    ampsUrl?: string;
  }) => {
    if (environmentToEdit) {
      updateEnvironment(environmentToEdit.id, updatedEnv);
      toast.success(`Environment "${updatedEnv.name}" updated successfully`);
      setEditModalOpen(false);
      setEnvironmentToEdit(undefined);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1 border-yellow-300/50 bg-transparent text-white hover:bg-white/10 hover:text-white w-full">
            <Globe className="h-4 w-4 mr-2" />
            {currentEnvironment.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 z-[150] bg-white">
          <DropdownMenuLabel className="!text-black">Environments</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {environments.map((env) => (
            <EnvironmentMenuItem 
              key={env.id} 
              env={env} 
              onSelect={handleEnvironmentChange} 
              onEdit={handleEditEnvironment}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {editModalOpen && environmentToEdit && (
        <EnvironmentModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEnvironmentToEdit(undefined);
          }}
          onSave={handleSaveEnvironment}
          environment={environmentToEdit}
          mode="edit"
        />
      )}
    </>
  );
};

export default EnvironmentSelector;
