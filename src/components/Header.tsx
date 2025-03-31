import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import * as LucideIcons from "lucide-react";
import { ExternalLink, Menu, PlusIcon, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import EnvironmentModal from "./EnvironmentModal";
import EnvironmentSelector from "./EnvironmentSelector";
import { useSidebar } from "./ui/sidebar";

// Define types for navigation items
interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  parentId?: string;
  children?: NavigationItem[];
}

const NAVIGATION_STORAGE_KEY = 'batchConnector.navigation';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { environments, importEnvironments, exportEnvironments, addEnvironment } = useEnvironment();
  const { open, toggleSidebar, setOpenMobile } = useSidebar();
  const location = useLocation();
  const [showNavDialog, setShowNavDialog] = useState(false);
  const [showNavManager, setShowNavManager] = useState(false);
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [navTitle, setNavTitle] = useState("");
  const [navUrl, setNavUrl] = useState("");
  const [navIcon, setNavIcon] = useState("ExternalLink");
  const [navParent, setNavParent] = useState("");
  const [currentPageTitle, setCurrentPageTitle] = useState("XVA Dashboard");
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

  // Update page title based on location
  useEffect(() => {
    updatePageTitle();
  }, [location.pathname]);

  // Function to determine the current page title based on route
  const updatePageTitle = () => {
    const path = location.pathname;
    
    // Default routes
    if (path === "/") {
      setCurrentPageTitle("XVA Dashboard");
      return;
    } else if (path === "/amps-viewer") {
      setCurrentPageTitle("Amps Viewer");
      return;
    } else if (path === "/grid-gain-viewer") {
      setCurrentPageTitle("Grid Gain Viewer");
      return;
    } else if (path === "/not-found" || path === "*") {
      setCurrentPageTitle("Page Not Found");
      return;
    }
    
    // Check custom navigation items for the title
    const findTitleFromNavItems = (items: NavigationItem[]) => {
      for (const item of items) {
        // Check if current path matches this item
        const itemPath = item.path.startsWith('http') ? 
          `/${encodeURIComponent(item.path)}` : item.path;
          
        if (path === itemPath) {
          setCurrentPageTitle(item.title);
          return true;
        }
        
        // Check children
        if (item.children && item.children.length > 0) {
          for (const child of item.children) {
            const childPath = child.path.startsWith('http') ? 
              `/${encodeURIComponent(child.path)}` : child.path;
              
            if (path === childPath) {
              setCurrentPageTitle(child.title);
              return true;
            }
          }
        }
      }
      return false;
    };
    
    // Try to find title from navigation items
    if (!findTitleFromNavItems(navigationItems)) {
      // If not found, set a default title
      setCurrentPageTitle("External Page");
    }
  };

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
    
    // Force reload to update routes
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Function to delete a navigation item
  const handleDeleteNavItem = (id: string) => {
    setNavigationItems(current => {
      // Filter out the item to be deleted from the top level
      const filtered = current.filter(item => item.id !== id);
      
      // Also remove from children arrays in any parent items
      filtered.forEach(item => {
        if (item.children) {
          item.children = item.children.filter(child => child.id !== id);
        }
      });
      
      return filtered;
    });
    
    toast.success("Navigation item deleted successfully");
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

  // Handle adding a new environment
  const handleSaveEnvironment = (envData: { name: string; baseUrl: string; description: string }) => {
    const newEnvironment = {
      id: uuidv4(),
      ...envData
    };
    
    addEnvironment(newEnvironment);
    setShowEnvModal(false);
    toast.success(`Environment "${envData.name}" added successfully`);
  };

  // Handle process creation by redirecting to main dashboard with dialog open
  const handleNewProcess = () => {
    // If we're not on the dashboard, navigate to it
    if (location.pathname !== '/') {
      window.location.href = '/?newProcess=true';
    } else {
      // Dispatch a custom event that Index.tsx can listen for
      const event = new CustomEvent('open-process-modal');
      window.dispatchEvent(event);
    }
    toast.info("Opening process creation dialog...");
  };

  // Dynamic icon component
  const DynamicIcon = ({ iconName }: { iconName: string }) => {
    const IconComponent = (LucideIcons as any)[iconName] || ExternalLink;
    return <IconComponent className="h-4 w-4" />;
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
              {currentPageTitle}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <EnvironmentSelector />
            
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
                {/* Add Process Button */}
                <DropdownMenuItem onClick={handleNewProcess}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Process
                </DropdownMenuItem>
                {/* Add Environment Button */}
                <DropdownMenuItem onClick={() => setShowEnvModal(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Environment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowNavDialog(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Navigation Item
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowNavManager(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Navigation Items
                </DropdownMenuItem>
                <DropdownMenuItem onClick={importNavigation}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Import Navigation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportNavigation}>
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

      {/* Manage Navigation Items Sheet */}
      <Sheet open={showNavManager} onOpenChange={setShowNavManager}>
        <SheetContent side="right" className="bg-white z-[150] overflow-y-auto w-[400px] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Manage Navigation Items</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="flex justify-between">
              <Button variant="outline" onClick={importNavigation}>
                <DynamicIcon iconName="Upload" />
                <span className="ml-2">Import</span>
              </Button>
              <Button variant="outline" onClick={exportNavigation}>
                <DynamicIcon iconName="Download" />
                <span className="ml-2">Export</span>
              </Button>
            </div>
            
            <div className="space-y-4 mt-4">
              <h3 className="font-medium text-lg">Navigation Items</h3>
              {navigationItems.length === 0 ? (
                <p className="text-muted-foreground">No navigation items yet. Add some to get started.</p>
              ) : (
                <div className="space-y-3">
                  {navigationItems.map(item => (
                    <div key={item.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{item.title}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteNavItem(item.id)}
                          className="h-7 text-red-500 hover:text-red-700"
                        >
                          <DynamicIcon iconName="X" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">Path: {item.path}</div>
                      <div className="text-sm text-muted-foreground">Icon: {item.icon}</div>
                      <div className="text-sm text-muted-foreground">ID: {item.id}</div>
                      
                      {item.children && item.children.length > 0 && (
                        <div className="pl-4 border-l mt-2 space-y-2">
                          <div className="text-sm font-medium">Child Items:</div>
                          {item.children.map(child => (
                            <div key={child.id} className="border-t pt-2">
                              <div className="flex justify-between items-center">
                                <div className="font-medium text-sm">{child.title}</div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteNavItem(child.id)}
                                  className="h-6 text-red-500 hover:text-red-700"
                                >
                                  <DynamicIcon iconName="X" />
                                </Button>
                              </div>
                              <div className="text-xs text-muted-foreground">Path: {child.path}</div>
                              <div className="text-xs text-muted-foreground">ID: {child.id}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                className="w-full mt-4" 
                onClick={() => {
                  setShowNavManager(false);
                  setTimeout(() => setShowNavDialog(true), 300);
                }}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Environment Modal */}
      <EnvironmentModal 
        isOpen={showEnvModal}
        onClose={() => setShowEnvModal(false)}
        onSave={handleSaveEnvironment}
      />
    </>
  );
};

export default Header;
