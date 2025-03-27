import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="font-medium text-xl tracking-tight">Naresh Dashboard</div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onNewProcess} className="hidden sm:flex items-center">
            <Plus className="mr-1 h-4 w-4" />
            New Process
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass">
              <DropdownMenuItem onClick={onNewProcess}>
                <Plus className="mr-2 h-4 w-4" />
                New Process
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onImportConfig}>
                Import Configuration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportConfig}>
                Export Configuration
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
};
export default Header;