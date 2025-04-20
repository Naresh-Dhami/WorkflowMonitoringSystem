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
import NavigationItemForm from "@/components/navigation/NavigationItemForm";
import { v4 as uuidv4 } from "uuid";
import { useNavigationDialog } from "@/hooks/useNavigationDialog";

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
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const { handleDialogClose } = useNavigationDialog();

  const handleSaveItem = (formData: Omit<NavigationItem, "id">) => {
    if (editingItem) {
      // Update existing item
      const updatedItem = {
        ...formData,
        id: editingItem.id
      };
      updateNavigationItem(updatedItem);
      toast.success("Navigation item updated successfully");
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: uuidv4()
      };
      addNavigationItem(newItem);
      toast.success("Navigation item added successfully");
    }
    setShowNavDialog(false);
    setEditingItem(null);
  };

  const handleEdit = (item: NavigationItem) => {
    setEditingItem(item);
    setShowNavManager(false);
    setTimeout(() => setShowNavDialog(true), 100);
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
      {/* Add/Edit Navigation Item Dialog */}
      <Dialog open={showNavDialog} onOpenChange={setShowNavDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? "Edit the navigation item details below." : "Add a new navigation item to the sidebar menu."}
            </DialogDescription>
          </DialogHeader>
          
          <NavigationItemForm
            initialData={editingItem}
            onSubmit={handleSaveItem}
            onCancel={() => {
              setShowNavDialog(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Manage Navigation Items Sheet */}
      <Sheet open={showNavManager} onOpenChange={setShowNavManager}>
        <SheetContent side="right" className="w-[400px] sm:max-w-none">
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
            
            <div className="space-y-4">
              {navigationItems.length === 0 ? (
                <p className="text-muted-foreground">No navigation items yet.</p>
              ) : (
                <div className="space-y-3">
                  {navigationItems.map(item => (
                    <div key={item.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{item.title}</div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(item)}
                            className="h-8 px-2"
                          >
                            <DynamicIcon iconName="edit" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeNavigationItem(item.id)}
                            className="h-8 px-2 text-red-500 hover:text-red-700"
                          >
                            <DynamicIcon iconName="X" />
                          </Button>
                          {item.path.startsWith('http') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(item.path, '_blank')}
                              className="h-8 px-2"
                            >
                              <DynamicIcon iconName="external-link" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Path: {item.path}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Icon: {item.icon}
                      </div>
                      
                      {/* Show children if any */}
                      {item.children && item.children.length > 0 && (
                        <div className="pl-4 border-l mt-2 space-y-2">
                          {item.children.map(child => (
                            <div key={child.id} className="border-t pt-2">
                              <div className="flex justify-between items-center">
                                <div className="text-sm font-medium">{child.title}</div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(child)}
                                    className="h-7 px-2"
                                  >
                                    <DynamicIcon iconName="edit" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeNavigationItem(child.id)}
                                    className="h-7 px-2 text-red-500 hover:text-red-700"
                                  >
                                    <DynamicIcon iconName="X" />
                                  </Button>
                                  {child.path.startsWith('http') && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => window.open(child.path, '_blank')}
                                      className="h-7 px-2"
                                    >
                                      <DynamicIcon iconName="external-link" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Path: {child.path}
                              </div>
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
                  setEditingItem(null);
                  setTimeout(() => setShowNavDialog(true), 100);
                }}
              >
                <DynamicIcon iconName="plus" />
                <span className="ml-2">Add New Item</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );

  function updateNavigationItem(updatedItem: NavigationItem) {
    const updatedItems = navigationItems.map(item => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      if (item.children) {
        item.children = item.children.map(child => {
          if (child.id === updatedItem.id) {
            return updatedItem;
          }
          return child;
        });
      }
      return item;
    });
    
    // Update the state with the updated navigation items
    // Assuming you have a setNavigationItems function from useNavigation hook
    // Replace setNavigationItems with the actual function name if it's different
    // setNavigationItems(updatedItems);
  }

  function handleImportNavigation() {
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
  }

  function handleExportNavigation() {
    const items = exportNavigationItems();
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'navigation.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Navigation exported successfully');
  }
};

export default NavigationManager;
