
import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Menu, Settings, LayersIcon, X } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const location = useLocation();
  const { navigationItems } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  // Function to get Lucide icon from string
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Settings: <Settings className="h-4 w-4" />,
      ExternalLink: <ExternalLink className="h-4 w-4" />,
      Menu: <Menu className="h-4 w-4" />
    };
    
    return icons[iconName] || <ExternalLink className="h-4 w-4" />;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle navigation item click
  const handleNavItemClick = (path: string) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
      return false; // Prevent default Link behavior
    }
    return true; // Allow default Link behavior
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h2 className="text-lg font-semibold">Navigation</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive("/amps-viewer")}
              >
                <Link to="/amps-viewer">
                  <ExternalLink className="h-4 w-4" />
                  <span>AMPS Viewer</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive("/processes")}
              >
                <Link to="/processes">
                  <LayersIcon className="h-4 w-4" />
                  <span>XVA Processes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive("/grid-gain-viewer")}
              >
                <Link to="/grid-gain-viewer">
                  <ExternalLink className="h-4 w-4" />
                  <span>Grid Gain Viewer</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        {/* Custom Navigation Items */}
        {navigationItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Custom Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isExternal = item.path.startsWith('http');
                
                return (
                  <SidebarMenuItem key={item.id}>
                    {isExternal ? (
                      <SidebarMenuButton 
                        asChild 
                        onClick={() => window.open(item.path, '_blank')}
                      >
                        <a href={item.path} target="_blank" rel="noopener noreferrer">
                          {getIcon(item.icon)}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.path)}
                      >
                        <Link to={item.path}>
                          {getIcon(item.icon)}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          XVA Dashboard v1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
