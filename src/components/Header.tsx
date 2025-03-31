
import { Button } from "@/components/ui/button";
import { ChevronDown, Settings, Upload, Download, Menu, X, PlusIcon, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EnvironmentSelector from "./EnvironmentSelector";
import NavigationMenuComponent, { MobileNav } from "./NavigationMenu";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { toast } from "sonner";
import { useSidebar } from "./ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Define types for navigation items
interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  parentId?: string;
  children?: NavigationItem[];
}

interface HeaderProps {
  onNewProcess?: () => void;
  onImportConfig?: () => void;
  onExportConfig?: () => void;
}

const NAVIGATION_STORAGE_KEY = 'batchConnector.navigation';

const Header = ({
  onNewProcess,
  onImportConfig,
  onExportConfig
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { environments, importEnvironments, exportEnvironments } = useEnvironment();
  const { open, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNavDialog, setShowNavDialog] = useState(false);
  const [navTitle, setNavTitle] = useState("");
  const [navUrl, setNavUrl] = useState("");
  const [navIcon, setNavIcon] = useState("ExternalLink");
  const [navParent, setNavParent] = useState("");
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NAVIGATION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save navigation items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(navigationItems));
  }, [navigationItems]);

  // Handle adding a new navigation item
  const handleAddNavItem = () => {
    if (!navTitle || !navUrl) {
      toast.error("Title and URL are required");
      return;
    }

    const newItem: NavigationItem = {
      id: Date.now().toString(),
      title: navTitle,
      path: navUrl,
      icon: navIcon || "ExternalLink",
    };

    if (navParent) {
      newItem.parentId = navParent;
      
      // Add as child to parent
      setNavigationItems(current => {
        const updated = [...current];
        const parent = updated.find(item => item.id === navParent);
        
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(newItem);
        } else {
          // If parent not found, add as top-level
          delete newItem.parentId;
          updated.push(newItem);
        }
        
        return updated;
      });
    } else {
      // Add as top-level item
      setNavigationItems(current => [...current, newItem]);
    }

    // Reset form and close dialog
    setNavTitle("");
    setNavUrl("");
    setNavIcon("ExternalLink");
    setNavParent("");
    setShowNavDialog(false);
    
    toast.success("Navigation item added successfully");
  };

  // Export navigation items
  const exportNavigation = () => {
    const dataStr = JSON.stringify(navigationItems, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'navigation.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Navigation exported successfully');
  };

  // Import navigation items
  const importNavigation = () => {
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
          const items = JSON.parse(content) as NavigationItem[];
          setNavigationItems(items);
          toast.success('Navigation imported successfully');
          
          // Force reload to update routes
          window.location.reload();
        } catch (error) {
          console.error('Failed to import navigation:', error);
          toast.error('Failed to import navigation');
        }
      };
      
      reader.readAsText(file);
    };
    input.click();
  };

  // Improve performance with debounced toggle
  const handleToggleSidebar = () => {
    toggleSidebar();
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

  // Determine if we should show the New Process button based on route
  const shouldShowNewProcess = location.pathname === "/";
  
  // Handle New Process click - redirect to Index page if not there
  const handleNewProcessClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
      // Add a small delay before triggering the onNewProcess to ensure navigation is complete
      setTimeout(() => {
        if (onNewProcess) {
          onNewProcess();
        }
      }, 100);
    } else if (onNewProcess) {
      onNewProcess();
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 
          ${isScrolled 
            ? "bg-[#ea384c]/95 backdrop-blur-md shadow-sm" 
            : "bg-[#ea384c] border-b-4 border-[#FEF7CD]"
          }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              className="text-white hover:bg-white/10 z-[70]"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="font-medium text-xl tracking-tight text-white">
              {location.pathname === "/" && "Batch Dashboard"}
              {location.pathname === "/amps-viewer" && "Amps Viewer"}
              {location.pathname === "/grid-gain-viewer" && "Grid Gain Viewer"}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <EnvironmentSelector />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNewProcessClick} 
              className="hidden sm:flex items-center text-white hover:bg-white/10 hover:text-white"
            >
              <PlusIcon className="mr-1 h-4 w-4" />
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
              <DropdownMenuContent align="end" className="w-56 bg-background z-[100]">
                <DropdownMenuItem onClick={handleNewProcessClick}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Process
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowNavDialog(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Navigation Item
                </DropdownMenuItem>
                {onImportConfig && (
                  <DropdownMenuItem onClick={onImportConfig}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Configuration
                  </DropdownMenuItem>
                )}
                {onExportConfig && (
                  <DropdownMenuItem onClick={onExportConfig}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Configuration
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={importNavigation}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Navigation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportNavigation}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Navigation
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

      {/* Add Navigation Item Dialog */}
      <Dialog open={showNavDialog} onOpenChange={setShowNavDialog}>
        <DialogContent className="sm:max-w-[425px] z-[200]">
          <DialogHeader>
            <DialogTitle>Add Navigation Item</DialogTitle>
            <DialogDescription>
              Add a new navigation item to the sidebar menu. External URLs will open in an iframe.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={navTitle}
                onChange={(e) => setNavTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={navUrl}
                onChange={(e) => setNavUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com or /local-path"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Icon
              </Label>
              <Input
                id="icon"
                value={navIcon}
                onChange={(e) => setNavIcon(e.target.value)}
                placeholder="ExternalLink"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent" className="text-right">
                Parent ID
              </Label>
              <Input
                id="parent"
                value={navParent}
                onChange={(e) => setNavParent(e.target.value)}
                placeholder="Leave empty for top level"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNavDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddNavItem}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
