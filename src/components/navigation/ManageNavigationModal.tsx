
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowDownToLine, ArrowUpFromLine, Plus, Settings } from "lucide-react";
import { toast } from "sonner";
import { useNavigation, NavigationItem } from "@/hooks/useNavigation";
import NavigationItemForm from "./NavigationItemForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface ManageNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageNavigationModal: React.FC<ManageNavigationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { navigationItems, addNavigationItem, editNavigationItem, removeNavigationItem, importNavigationItems, exportNavigationItems } = useNavigation();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);

  const [imported, setImported] = useState(false);

  // Top-level items only
  const items = navigationItems || [];

  const handleEdit = (item: NavigationItem) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = (item: NavigationItem) => {
    setSelectedItem(item);
    setDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      removeNavigationItem(selectedItem.id);
      toast.success(`Navigation item "${selectedItem.title}" deleted successfully`);
      setDeleteAlertOpen(false);
      setSelectedItem(null);
    }
  };

  const handleAddNavigation = () => {
    setAddModalOpen(true);
  };

  const handleSaveNewNavigation = (itemData: Omit<NavigationItem, "id">) => {
    const newItem = {
      ...itemData,
      id: crypto.randomUUID(),
      icon: "settings", // Always use "settings" icon for new entries
    };
    addNavigationItem(newItem);
    setAddModalOpen(false);
    toast.success(`Navigation item "${itemData.title}" added successfully`);
  };

  const handleSaveNavigation = (itemData: Omit<NavigationItem, "id">) => {
    if (selectedItem) {
      const updatedItem = {
        ...itemData,
        id: selectedItem.id,
        icon: "settings", // Always use "settings" icon
      };
      editNavigationItem(updatedItem);
      toast.success(`Navigation item "${itemData.title}" updated successfully`);
      setEditModalOpen(false);
      setSelectedItem(null);
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
          setImported(true);
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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl z-[200]">
          <DialogHeader>
            <DialogTitle>Manage Navigation Items</DialogTitle>
            <DialogDescription>
              Add, edit, delete, import, and export your navigation items used in the app.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between items-center my-4">
            <Button onClick={handleAddNavigation}>
              <Plus className="mr-2 h-4 w-4" />
              Add Navigation Item
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
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No navigation items found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={item.path}>
                        {item.path}
                      </TableCell>
                      <TableCell>
                        <Settings className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {addModalOpen && (
        <NavigationItemForm
          onSubmit={handleSaveNewNavigation}
          onCancel={() => setAddModalOpen(false)}
          mode="create"
        />
      )}

      {editModalOpen && selectedItem && (
        <NavigationItemForm
          onSubmit={handleSaveNavigation}
          onCancel={() => {
            setEditModalOpen(false);
            setSelectedItem(null);
          }}
          initialData={selectedItem}
          mode="edit"
        />
      )}

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the navigation item "{selectedItem?.title}". This action cannot be undone.
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
};
export default ManageNavigationModal;
