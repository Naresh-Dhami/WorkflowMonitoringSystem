
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
import { ExternalLink, Menu, Settings, LayersIcon, X, Bot } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const location = useLocation();
  const { navigationItems } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
                isActive={isActive("/grid-gain-viewer")}
              >
                <Link to="/grid-gain-viewer">
                  <ExternalLink className="h-4 w-4" />
                  <span>Grid Gain Viewer</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive("/chatbot")}
              >
                <Link to="/chatbot">
                  <Bot className="h-4 w-4" />
                  <span>AI Chatbot</span>
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
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                  >
                    {item.path.startsWith('http') ? (
                      <a href={item.path} target="_blank" rel="noopener noreferrer">
                        <Settings className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <Link to={item.path}>
                        <Settings className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
