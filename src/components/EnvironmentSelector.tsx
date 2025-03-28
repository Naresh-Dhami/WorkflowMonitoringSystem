
import { Button } from "@/components/ui/button";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const EnvironmentSelector = () => {
  const { environments, currentEnvironment, setEnvironment } = useEnvironment();

  const handleEnvironmentChange = (envId: string) => {
    setEnvironment(envId);
    toast.success(`Environment switched to ${environments.find(e => e.id === envId)?.name}`);
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
          <DropdownMenuItem
            key={env.id}
            className={`${env.id === currentEnvironment.id ? 'bg-accent/50' : ''} cursor-pointer`}
            onClick={() => handleEnvironmentChange(env.id)}
          >
            <div className="flex flex-col">
              <span>{env.name}</span>
              <span className="text-xs text-muted-foreground">{env.baseUrl}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnvironmentSelector;
