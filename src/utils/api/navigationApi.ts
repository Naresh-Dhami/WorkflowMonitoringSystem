
import { NavigationItem } from "@/hooks/useNavigation";
import { toast } from "sonner";

const API_BASE_URL = "/api";
const NAVIGATION_ENDPOINT = `${API_BASE_URL}/navigation`;
const NAVIGATION_STORAGE_KEY = 'batchConnector.navigation';

// For demo purposes, we'll simulate API calls with local storage
// In a real application, these would be actual API calls

// Get all navigation items
export const fetchNavigationItems = async (): Promise<NavigationItem[]> => {
  try {
    // In a real app:
    // const response = await fetch(NAVIGATION_ENDPOINT);
    // if (!response.ok) throw new Error('Failed to fetch navigation items');
    // return await response.json();
    
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem(NAVIGATION_STORAGE_KEY);
        resolve(saved ? JSON.parse(saved) : []);
      }, 300);
    });
  } catch (error) {
    console.error("Error fetching navigation items:", error);
    toast.error("Failed to load navigation items");
    return [];
  }
};

// Create a new navigation item
export const createNavigationItem = async (item: Omit<NavigationItem, "id">): Promise<NavigationItem> => {
  try {
    // In a real app:
    // const response = await fetch(NAVIGATION_ENDPOINT, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(item)
    // });
    // if (!response.ok) throw new Error('Failed to create navigation item');
    // return await response.json();
    
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem = {
          ...item,
          id: crypto.randomUUID()
        };
        
        const saved = localStorage.getItem(NAVIGATION_STORAGE_KEY);
        const items = saved ? JSON.parse(saved) : [];
        
        let updatedItems;
        if (newItem.parentId) {
          // Add as child to parent
          updatedItems = [...items];
          const parent = updatedItems.find(i => i.id === newItem.parentId);
          
          if (parent) {
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(newItem);
          } else {
            // If parent not found, add as top-level
            delete newItem.parentId;
            updatedItems.push(newItem);
          }
        } else {
          // Add as top-level item
          updatedItems = [...items, newItem];
        }
        
        localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(updatedItems));
        resolve(newItem);
      }, 400);
    });
  } catch (error) {
    console.error("Error creating navigation item:", error);
    toast.error("Failed to create navigation item");
    throw error;
  }
};

// Update a navigation item
export const updateNavigationItem = async (id: string, updates: Partial<NavigationItem>): Promise<NavigationItem> => {
  try {
    // In a real app:
    // const response = await fetch(`${NAVIGATION_ENDPOINT}/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates)
    // });
    // if (!response.ok) throw new Error('Failed to update navigation item');
    // return await response.json();
    
    // Simulated API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const saved = localStorage.getItem(NAVIGATION_STORAGE_KEY);
        let items = saved ? JSON.parse(saved) : [];
        
        // Helper function to update an item in the tree
        const updateItemInList = (
          listItems: NavigationItem[], 
          targetId: string, 
          updates: Partial<NavigationItem>
        ): NavigationItem[] => {
          return listItems.map(item => {
            if (item.id === targetId) {
              return { ...item, ...updates };
            }
            
            if (item.children) {
              return {
                ...item,
                children: updateItemInList(item.children, targetId, updates)
              };
            }
            
            return item;
          });
        };
        
        items = updateItemInList(items, id, updates);
        localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(items));
        
        // Find the updated item to return
        const findUpdated = (listItems: NavigationItem[], targetId: string): NavigationItem | null => {
          for (const item of listItems) {
            if (item.id === targetId) return item;
            if (item.children) {
              const found = findUpdated(item.children, targetId);
              if (found) return found;
            }
          }
          return null;
        };
        
        const updated = findUpdated(items, id);
        if (!updated) {
          reject(new Error(`Navigation item with ID ${id} not found`));
          return;
        }
        
        resolve(updated);
      }, 400);
    });
  } catch (error) {
    console.error(`Error updating navigation item ${id}:`, error);
    toast.error("Failed to update navigation item");
    throw error;
  }
};

// Delete a navigation item
export const deleteNavigationItem = async (id: string): Promise<void> => {
  try {
    // In a real app:
    // const response = await fetch(`${NAVIGATION_ENDPOINT}/${id}`, {
    //   method: 'DELETE'
    // });
    // if (!response.ok) throw new Error('Failed to delete navigation item');
    
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem(NAVIGATION_STORAGE_KEY);
        let items = saved ? JSON.parse(saved) : [];
        
        // Helper function to remove item from the tree
        const removeItemFromList = (
          listItems: NavigationItem[], 
          targetId: string
        ): NavigationItem[] => {
          // Filter out the item at the current level
          const filtered = listItems.filter(item => item.id !== targetId);
          
          // Also check and update children
          return filtered.map(item => {
            if (item.children) {
              return {
                ...item,
                children: removeItemFromList(item.children, targetId)
              };
            }
            return item;
          });
        };
        
        items = removeItemFromList(items, id);
        localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(items));
        
        resolve();
      }, 400);
    });
  } catch (error) {
    console.error(`Error deleting navigation item ${id}:`, error);
    toast.error("Failed to delete navigation item");
    throw error;
  }
};

// Import navigation items
export const importNavigationItems = async (items: NavigationItem[]): Promise<boolean> => {
  try {
    // In a real app:
    // const response = await fetch(`${NAVIGATION_ENDPOINT}/import`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(items)
    // });
    // if (!response.ok) throw new Error('Failed to import navigation items');
    // return true;
    
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(items));
        resolve(true);
      }, 600);
    });
  } catch (error) {
    console.error("Error importing navigation items:", error);
    toast.error("Failed to import navigation items");
    return false;
  }
};

// Export navigation items
export const exportNavigationItems = async (): Promise<NavigationItem[]> => {
  try {
    // In a real app:
    // const response = await fetch(`${NAVIGATION_ENDPOINT}/export`);
    // if (!response.ok) throw new Error('Failed to export navigation items');
    // return await response.json();
    
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem(NAVIGATION_STORAGE_KEY);
        resolve(saved ? JSON.parse(saved) : []);
      }, 400);
    });
  } catch (error) {
    console.error("Error exporting navigation items:", error);
    toast.error("Failed to export navigation items");
    return [];
  }
};
