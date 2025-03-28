
import { useLocation, Link } from "react-router-dom";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Grid, Zap, Settings } from "lucide-react";
import EnvironmentSelector from "./EnvironmentSelector";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <Sidebar className="border-r border-[#FEF7CD]/20">
          <SidebarHeader className="border-b border-[#FEF7CD]/20 py-4">
            <div className="flex items-center justify-center">
              <span className="text-lg font-semibold text-white">Batch Dashboard</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Batch Dashboard" isActive={isActive("/")}>
                      <Link to="/">
                        <Home />
                        <span>Batch Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Amps Viewer" isActive={isActive("/amps-viewer")}>
                      <Link to="/amps-viewer">
                        <Zap />
                        <span>Amps Viewer</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Grid Gain Viewer" isActive={isActive("/grid-gain-viewer")}>
                      <Link to="/grid-gain-viewer">
                        <Grid />
                        <span>Grid Gain Viewer</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
              <Settings className="h-5 w-5 text-white/70" />
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AppSidebar;
