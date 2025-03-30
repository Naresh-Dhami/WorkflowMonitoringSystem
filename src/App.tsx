
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { EnvironmentProvider } from "./contexts/EnvironmentContext";
import AmpsViewer from "./pages/AmpsViewer";
import GridGainViewer from "./pages/GridGainViewer";
import AppSidebar from "./components/AppSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import Header from "./components/Header";

// Custom page component for dynamic navigation
const DynamicPage = ({ url }: { url: string }) => {
  return (
    <div className="container mx-auto p-6 pt-24">
      <iframe 
        src={url} 
        className="w-full h-[calc(100vh-100px)] border-0 rounded-lg shadow-md"
        title="External content"
      />
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => {
  const [navigationRoutes, setNavigationRoutes] = useState<{path: string, url: string}[]>([]);

  useEffect(() => {
    // Load custom navigation items from localStorage
    try {
      const saved = localStorage.getItem('batchConnector.navigation');
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items)) {
          const routes = items.map(item => ({
            path: item.path.startsWith('/') ? item.path : `/${item.path.replace(/^https?:\/\//, '')}`,
            url: item.path.startsWith('http') ? item.path : `https://${item.path}`
          }));
          setNavigationRoutes(routes);
        }
      }
    } catch (e) {
      console.error("Error loading navigation routes:", e);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EnvironmentProvider>
        <BrowserRouter>
          <TooltipProvider>
            <SidebarProvider defaultOpen={false}>
              <div className="flex w-full min-h-screen">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/amps-viewer" element={<AmpsViewer />} />
                    <Route path="/grid-gain-viewer" element={<GridGainViewer />} />
                    
                    {/* Dynamic routes based on user-added navigation */}
                    {navigationRoutes.map((route, index) => (
                      <Route 
                        key={`dynamic-route-${index}`}
                        path={route.path}
                        element={<DynamicPage url={route.url} />}
                      />
                    ))}
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </EnvironmentProvider>
    </QueryClientProvider>
  );
};

export default App;
