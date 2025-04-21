
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import * as LucideIcons from "lucide-react";
import { Pencil, Trash2, ArrowDownToLine, ArrowUpFromLine, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NavigationItem, useNavigation } from "@/hooks/useNavigation";
import NavigationItemForm from "@/components/navigation/NavigationItemForm";
import { v4 as uuidv4 } from "uuid";
import { useNavigationDialog } from "@/hooks/useNavigationDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Dynamic icon component
const DynamicIcon = ({ iconName }: { iconName: string }) => {
  const IconComponent = (LucideIcons as any)[iconName] || Settings;
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
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NavigationItem | null>(null);
  const { handleDialogClose } = useNavigationDialog();

  const handleSaveItem = (formData: Omit<NavigationItem, "id">) => {
    if (editingItem) {
      const updatedItem = {
        ...formData,
        id: editingItem.id,
        icon: "settings"
      };
      updateNavigationItem(updatedItem);
      toast.success("Navigation item updated successfully");
    } else {
      const newItem = {
        ...formData,
        id: uuidv4(),
        icon: "settings"
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

  const handleDelete = (item: NavigationItem) => {
    setItemToDelete(item);
    setDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeNavigationItem(itemToDelete.id);
      toast.success(`Navigation item "${itemToDelete.title}" deleted successfully`);
      setDeleteAlertOpen(false);
      setItemToDelete(null);
    }
  };

  const handleImportNavigation = () => {
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

  const handleExportNavigation = () => {
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
              <Button onClick={() => {
                setShowNavManager(false);
                setEditingItem(null);
                setTimeout(() => setShowNavDialog(true), 100);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleImportNavigation}>
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" onClick={handleExportNavigation}>
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
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
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(item)}
                            className="h-8 px-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {item.path.startsWith('http') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(item.path, '_blank')}
                              className="h-8 px-2"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Path: {item.path}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Icon: settings
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
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(child)}
                                    className="h-7 px-2 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  {child.path.startsWith('http') && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => window.open(child.path, '_blank')}
                                      className="h-7 px-2"
                                    >
                                      <Settings className="h-4 w-4" />
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
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the navigation item "{itemToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
    importNavigationItems(updatedItems);
  }
};
export default NavigationManager;
