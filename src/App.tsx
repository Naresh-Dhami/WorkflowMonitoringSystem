
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <EnvironmentProvider>
      <BrowserRouter>
        <TooltipProvider>
          <SidebarProvider defaultOpen={false}>
            <div className="flex w-full min-h-screen">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/amps-viewer" element={<AmpsViewer />} />
                  <Route path="/grid-gain-viewer" element={<GridGainViewer />} />
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

export default App;
