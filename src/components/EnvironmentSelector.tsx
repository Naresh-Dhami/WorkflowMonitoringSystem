
import { Button } from "@/components/ui/button";
import { useEnvironment, Environment } from "@/contexts/EnvironmentContext";
import { Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const EnvironmentMenuItem = ({ env, onSelect }: { env: Environment, onSelect: (envId: string) => void }) => {
  if (env.children && env.children.length > 0) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer !text-black">
          <div className="flex flex-col">
            <span>{env.name}</span>
            <span className="text-xs text-muted-foreground">{env.baseUrl}</span>
          </div>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            className="cursor-pointer !text-black"
            onClick={() => onSelect(env.id)}
          >
            <div className="flex flex-col">
              <span>{env.name} (Root)</span>
              <span className="text-xs text-muted-foreground">{env.baseUrl}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {env.children.map((childEnv) => (
            <EnvironmentMenuItem key={childEnv.id} env={childEnv} onSelect={onSelect} />
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenuItem
      className="cursor-pointer !text-black"
      onClick={() => onSelect(env.id)}
    >
      <div className="flex flex-col">
        <span>{env.name}</span>
        <span className="text-xs text-muted-foreground">{env.baseUrl}</span>
      </div>
    </DropdownMenuItem>
  );
};

const EnvironmentSelector = () => {
  const { environments, currentEnvironment, setEnvironment } = useEnvironment();

  const handleEnvironmentChange = (envId: string) => {
    setEnvironment(envId);
    toast.success(`Environment switched to ${currentEnvironment.name}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1 border-yellow-300/50 bg-transparent text-white hover:bg-white/10 hover:text-white">
          <Globe className="h-4 w-4" />
          {currentEnvironment.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Environments</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {environments.map((env) => (
          <EnvironmentMenuItem 
            key={env.id} 
            env={env} 
            onSelect={handleEnvironmentChange} 
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnvironmentSelector;
