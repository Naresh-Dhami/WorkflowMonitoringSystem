
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, Settings, Upload, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EnvironmentSelector from "./EnvironmentSelector";
import NavigationMenuComponent, { MobileNav } from "./NavigationMenu";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { toast } from "sonner";

interface HeaderProps {
  onNewProcess: () => void;
  onImportConfig: () => void;
  onExportConfig: () => void;
}

const Header = ({
  onNewProcess,
  onImportConfig,
  onExportConfig
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { environments, importEnvironments, exportEnvironments } = useEnvironment();

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 
        ${isScrolled 
          ? "bg-[#ea384c]/95 backdrop-blur-md shadow-sm" 
          : "bg-[#ea384c] border-b-4 border-[#FEF7CD]"
        }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileNav />
          <div className="font-medium text-xl tracking-tight text-white">
            Batch Dashboard
          </div>
          <NavigationMenuComponent />
        </div>
        
        <div className="flex items-center space-x-2">
          <EnvironmentSelector />
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onNewProcess} 
            className="hidden sm:flex items-center text-white hover:bg-white/10 hover:text-white"
          >
            <Plus className="mr-1 h-4 w-4" />
            New Process
          </Button>
          
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
            <DropdownMenuContent align="end" className="w-56 glass">
              <DropdownMenuItem onClick={onNewProcess}>
                <Plus className="mr-2 h-4 w-4" />
                New Process
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onImportConfig}>
                <Upload className="mr-2 h-4 w-4" />
                Import Configuration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportConfig}>
                <Download className="mr-2 h-4 w-4" />
                Export Configuration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportEnvironments}>
                <Upload className="mr-2 h-4 w-4" />
                Import Environments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportEnvironments}>
                <Download className="mr-2 h-4 w-4" />
                Export Environments
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
