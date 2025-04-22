
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, Settings } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { useSidebar } from "./ui/sidebar";
import NavItem from "./navigation/NavItem";
import NavSubmenu from "./navigation/NavSubmenu";

const NavigationMenuComponent = () => {
  const location = useLocation();
  const [customNavItems, setCustomNavItems] = useState([]);
  const { navigationItems } = useNavigation();
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem('batchConnector.navigation');
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items)) {
          setCustomNavItems(items.filter(item => !item.parentId));
        }
      }
    } catch (e) {
      console.error("Error loading navigation items:", e);
    }
  }, []);
  
  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    if (path.startsWith('http')) {
      e.preventDefault();
      window.open(path, '_blank');
    }
  };

  return (
    <div className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          {/* Default navigation items */}
          <NavigationMenuItem>
            <NavItem
              path="/"
              title="XVA Dashboard"
              isActive={isActive("/")}
            />
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavItem
              path="/amps-viewer"
              title="Amps Viewer"
              isActive={isActive("/amps-viewer")}
            />
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavItem
              path="/processes"
              title="XVA Processes"
              isActive={isActive("/processes")}
            />
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavItem
              path="/grid-gain-viewer"
              title="Grid Gain Viewer"
              isActive={isActive("/grid-gain-viewer")}
            />
          </NavigationMenuItem>

          {/* Custom navigation items */}
          {navigationItems.map((item) => (
            <NavigationMenuItem key={item.id}>
              {item.children && item.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger>
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavSubmenu items={item.children} onItemClick={handleNavClick} />
                </>
              ) : (
                <NavItem
                  path={item.path}
                  title={item.title}
                  isActive={isActive(item.path)}
                  isExternal={item.path.startsWith('http')}
                  onClick={handleNavClick}
                />
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

// Mobile navigation menu
export const MobileNav = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="text-white"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  );
};

export default NavigationMenuComponent;
