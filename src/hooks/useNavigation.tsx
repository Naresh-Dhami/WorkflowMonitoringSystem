
import { useState, useEffect, useCallback } from 'react';

// Define types for navigation items
export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  parentId?: string;
  children?: NavigationItem[];
}

const NAVIGATION_STORAGE_KEY = 'batchConnector.navigation';

export function useNavigation() {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NAVIGATION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading navigation items:', e);
      return [];
    }
  });

  // Save navigation items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(navigationItems));
  }, [navigationItems]);

  // Add a new navigation item
  const addNavigationItem = useCallback((newItem: NavigationItem) => {
    if (newItem.parentId) {
      // Add as child to parent
      setNavigationItems(current => {
        const updated = [...current];
        const parent = updated.find(i => i.id === newItem.parentId);
        
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

    return newItem;
  }, []);

  // Edit navigation item
  const editNavigationItem = useCallback((updatedItem: NavigationItem) => {
    setNavigationItems(current => {
      return current.map(item => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        
        if (item.children) {
          return {
            ...item,
            children: item.children.map(child => {
              if (child.id === updatedItem.id) {
                return updatedItem;
              }
              return child;
            })
          };
        }
        
        return item;
      });
    });
  }, []);

  // Remove a navigation item
  const removeNavigationItem = useCallback((id: string) => {
    setNavigationItems(current => {
      // Remove from top level
      const filtered = current.filter(item => item.id !== id);
      
      // Remove from children
      filtered.forEach(item => {
        if (item.children) {
          item.children = item.children.filter(child => child.id !== id);
        }
      });
      
      return filtered;
    });
  }, []);

  // Import navigation items
  const importNavigationItems = useCallback((items: NavigationItem[]) => {
    setNavigationItems(items);
  }, []);

  // Export navigation items
  const exportNavigationItems = useCallback(() => {
    return navigationItems;
  }, [navigationItems]);

  return {
    navigationItems,
    addNavigationItem,
    editNavigationItem,
    removeNavigationItem,
    importNavigationItems,
    exportNavigationItems
  };
}
