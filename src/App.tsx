import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Submit from "./pages/Submit";
import Community from "./pages/Community";
import Battles from "./pages/Battles";
import Recipe from "./pages/Recipe";
import { Topic } from "@/components/community/forum/Topic";
import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useSession();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => {
  // Initialize session from local storage
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Refresh the session if it exists
        supabase.auth.refreshSession();
      }
    });

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        console.log("Auth state changed:", _event, session.user?.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/submit" element={
                <ProtectedRoute>
                  <Submit />
                </ProtectedRoute>
              } />
              <Route path="/community" element={<Community />} />
              <Route path="/community/topic/:topicId" element={<Topic />} />
              <Route path="/battles" element={<Battles />} />
              <Route path="/recipe/:recipeId" element={<Recipe />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;