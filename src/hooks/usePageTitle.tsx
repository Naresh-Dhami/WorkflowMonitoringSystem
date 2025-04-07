
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from './useNavigation';

export function usePageTitle() {
  const [currentPageTitle, setCurrentPageTitle] = useState("XVA Dashboard");
  const location = useLocation();
  const { navigationItems } = useNavigation();

  // Update page title based on location
  useEffect(() => {
    updatePageTitle();
  }, [location.pathname, navigationItems]);

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
    const findTitleFromNavItems = (items: typeof navigationItems) => {
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

  return { currentPageTitle };
}
