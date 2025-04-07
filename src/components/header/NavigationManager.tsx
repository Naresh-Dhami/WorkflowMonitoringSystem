
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import * as LucideIcons from "lucide-react";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NavigationItem, useNavigation } from "@/hooks/useNavigation";

// Dynamic icon component
const DynamicIcon = ({ iconName }: { iconName: string }) => {
  const IconComponent = (LucideIcons as any)[iconName] || ExternalLink;
  return <IconComponent className="h-4 w-4" />;
};

interface NavigationManagerProps {
  showNavDialog: boolean;
  setShowNavDialog: (show: boolean) => void;
  showNavManager: boolean;
  setShowNavManager: (show: boolean) => void;
}

const NavigationManager = ({
  showNavDialog,
  setShowNavDialog,
  showNavManager,
  setShowNavManager
}: NavigationManagerProps) => {
  const { navigationItems, addNavigationItem, removeNavigationItem, importNavigationItems, exportNavigationItems } = useNavigation();
  const [navTitle, setNavTitle] = useState("");
  const [navUrl, setNavUrl] = useState("");
  const [navIcon, setNavIcon] = useState("ExternalLink");
  const [navParent, setNavParent] = useState("");

  // Handle adding a new navigation item
  const handleAddNavItem = () => {
    if (!navTitle || !navUrl) {
      toast.error("Title and URL are required");
      return;
    }

    const newItem: Omit<NavigationItem, 'id'> = {
      title: navTitle,
      path: navUrl,
      icon: navIcon || "ExternalLink",
    };

    if (navParent) {
      newItem.parentId = navParent;
    }

    addNavigationItem(newItem);

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
          importNavigationItems(items);
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

  // Export navigation items
  const exportNavigation = () => {
    const items = exportNavigationItems();
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'navigation.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Navigation exported successfully');
  };

  return (
    <>
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
                          onClick={() => removeNavigationItem(item.id)}
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
                                  onClick={() => removeNavigationItem(child.id)}
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
                <DynamicIcon iconName="PlusIcon" />
                <span className="ml-2">Add New Item</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NavigationManager;
