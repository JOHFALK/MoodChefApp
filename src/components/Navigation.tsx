import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, Plus, User, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddRecipe = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit recipes",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    // Handle recipe submission logic
  };

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <ChefHat className="w-8 h-8 text-primary animate-float" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MoodChef
            </h1>
          </motion.div>
          <div className="flex items-center gap-4">
            {user ? (
              <Button
                variant="ghost"
                className="text-sm font-medium hover:bg-primary/10"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="text-sm font-medium hover:bg-primary/10"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-primary/10 z-50">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <Button 
            variant="ghost" 
            className={cn(
              "flex-col gap-1 hover:bg-primary/10",
              location.pathname === "/" && "text-primary"
            )}
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "flex-col gap-1 hover:bg-primary/10",
              location.pathname === "/search" && "text-primary"
            )}
            onClick={() => navigate("/search")}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col gap-1 relative hover:bg-transparent"
            onClick={handleAddRecipe}
          >
            <div className="absolute -top-6 bg-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs mt-4">Add</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "flex-col gap-1 hover:bg-primary/10",
              location.pathname === "/dashboard" && "text-primary"
            )}
            onClick={() => navigate(user ? "/dashboard" : "/login")}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">{user ? "Profile" : "Sign In"}</span>
          </Button>
        </div>
      </nav>

      {/* Content Padding */}
      <div className="pb-16 pt-20" />
    </>
  );
}