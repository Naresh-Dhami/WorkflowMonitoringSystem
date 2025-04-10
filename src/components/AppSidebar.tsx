
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import * as LucideIcons from "lucide-react";
import { ExternalLink, Grid, Home, Settings, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import EnvironmentSelector from "./EnvironmentSelector";
import { Button } from "./ui/button";

// Define types for navigation items
interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  parentId?: string;
  children?: NavigationItem[];
}

export function AppSidebar() {
  const location = useLocation();
  const { open, toggleSidebar, setOpenMobile, openMobile } = useSidebar();
  const [customNavItems, setCustomNavItems] = useState<NavigationItem[]>([]);
  
  // Load custom navigation items from localStorage
  const loadNavigationItems = () => {
    try {
      const saved = localStorage.getItem('batchConnector.navigation');
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items)) {
          // Filter to only top-level items (no parentId)
          setCustomNavItems(items.filter(item => !item.parentId));
        }
      }
    } catch (e) {
      console.error("Error loading navigation items:", e);
    }
  };
  
  useEffect(() => {
    loadNavigationItems();
    
    // Add event listener to reload navigation items when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'batchConnector.navigation') {
        loadNavigationItems();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Also close sidebar when route changes
  useEffect(() => {
    if (openMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, openMobile, setOpenMobile]);
  
  const isActive = (path: string) => location.pathname === path;

  // Dynamic icon component
  const DynamicIcon = ({ iconName }: { iconName: string }) => {
    const IconComponent = (LucideIcons as any)[iconName] || ExternalLink;
    return <IconComponent className="h-5 w-5" />;
  };

  const closeSidebar = () => {
    if (openMobile) {
      setOpenMobile(false);
    }
  };

  // Custom event to refresh navigation after dialog closes
  useEffect(() => {
    const handleRefreshNav = () => {
      loadNavigationItems();
    };
    
    window.addEventListener('refreshNavigation', handleRefreshNav);
    
    return () => {
      window.removeEventListener('refreshNavigation', handleRefreshNav);
    };
  }, []);

  return (
    <Sidebar className="border-r border-[#FEF7CD]/20 z-[60] bg-[#ea384c]">
      <SidebarHeader className="border-b border-[#FEF7CD]/20 py-4 flex items-center justify-between px-4">
        <div className="flex items-center justify-center">
          <span className="text-lg font-semibold text-white">XVA Dashboard</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setOpenMobile(false)}
          className="text-white md:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close menu</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu id="main-navigation">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="XVA Processes" isActive={isActive("/")} onClick={closeSidebar}>
                  <Link to="/">
                    <Home />
                    <span>XVA Processes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Amps Viewer" isActive={isActive("/amps-viewer")} onClick={closeSidebar}>
                  <Link to="/amps-viewer">
                    <Zap />
                    <span>Amps Viewer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Grid Gain Viewer" isActive={isActive("/grid-gain-viewer")} onClick={closeSidebar}>
                  <Link to="/grid-gain-viewer">
                    <Grid />
                    <span>Grid Gain Viewer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Custom navigation items */}
              {customNavItems.map(item => (
                <SidebarMenuItem key={item.id}>
                  {item.children && item.children.length > 0 ? (
                    <SidebarMenuSub>
                      <SidebarMenuButton>
                        <DynamicIcon iconName={item.icon} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.children.map(child => (
                        <SidebarMenuSubItem key={child.id}>
                          <SidebarMenuSubButton asChild onClick={closeSidebar}>
                            <Link to={child.path.startsWith('http') ? `/${encodeURIComponent(child.path)}` : child.path}>
                              <DynamicIcon iconName={child.icon || "ExternalLink"} />
                              <span>{child.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : (
                    <SidebarMenuButton asChild onClick={closeSidebar}>
                      <Link to={item.path.startsWith('http') ? `/${encodeURIComponent(item.path)}` : item.path}>
                        <DynamicIcon iconName={item.icon} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Environment</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1">
              <EnvironmentSelector />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#FEF7CD]/20 p-4">
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              toast.info("Settings would be managed here");
            }}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
