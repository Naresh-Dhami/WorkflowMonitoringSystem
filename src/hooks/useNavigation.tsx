
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchNavigationItems, 
  createNavigationItem, 
  updateNavigationItem, 
  deleteNavigationItem,
  importNavigationItems as importNavApi,
  exportNavigationItems as exportNavApi
} from '@/utils/api/navigationApi';
import { toast } from 'sonner';

// Define types for navigation items
export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  parentId?: string;
  children?: NavigationItem[];
}

export function useNavigation() {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load navigation items when the hook mounts
  useEffect(() => {
    const loadNavigation = async () => {
      setIsLoading(true);
      try {
        const items = await fetchNavigationItems();
        setNavigationItems(items);
      } catch (error) {
        console.error('Error loading navigation items:', error);
        toast.error('Failed to load navigation items');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNavigation();
  }, []);

  // Add a new navigation item
  const addNavigationItem = useCallback(async (newItem: Omit<NavigationItem, "id">) => {
    try {
      const item = await createNavigationItem(newItem);
      setNavigationItems(await fetchNavigationItems());
      return item;
    } catch (error) {
      console.error('Error adding navigation item:', error);
      toast.error('Failed to add navigation item');
      throw error;
    }
  }, []);

  // Edit navigation item
  const editNavigationItem = useCallback(async (updatedItem: NavigationItem) => {
    try {
      const { id, ...itemData } = updatedItem;
      await updateNavigationItem(id, itemData);
      setNavigationItems(await fetchNavigationItems());
    } catch (error) {
      console.error('Error updating navigation item:', error);
      toast.error('Failed to update navigation item');
      throw error;
    }
  }, []);

  // Remove a navigation item
  const removeNavigationItem = useCallback(async (id: string) => {
    try {
      await deleteNavigationItem(id);
      setNavigationItems(await fetchNavigationItems());
    } catch (error) {
      console.error('Error removing navigation item:', error);
      toast.error('Failed to remove navigation item');
      throw error;
    }
  }, []);

  // Import navigation items
  const importNavigationItems = useCallback(async (items: NavigationItem[]) => {
    try {
      await importNavApi(items);
      setNavigationItems(await fetchNavigationItems());
    } catch (error) {
      console.error('Error importing navigation items:', error);
      toast.error('Failed to import navigation items');
      throw error;
    }
  }, []);

  // Export navigation items
  const exportNavigationItems = useCallback(async () => {
    try {
      return await exportNavApi();
    } catch (error) {
      console.error('Error exporting navigation items:', error);
      toast.error('Failed to export navigation items');
      throw error;
    }
  }, []);

  return {
    navigationItems,
    isLoading,
    addNavigationItem,
    editNavigationItem,
    removeNavigationItem,
    importNavigationItems,
    exportNavigationItems
  };
}
