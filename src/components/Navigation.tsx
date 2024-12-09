import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, Menu, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    navigate("/submit");
  };

  const navItems = [
    { label: "Explore", path: "/" },
    { 
      label: "Community", 
      path: "/community",
      icon: Users,
      description: "Share stories & photos"
    },
    { 
      label: "Battles", 
      path: "/community?tab=battles",
      icon: Trophy,
      description: "Join cooking challenges"
    },
    { label: "Pricing", path: "/pricing" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <ChefHat className="w-7 h-7 text-primary" />
            <span className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              MoodChef
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "text-sm font-medium hover:bg-primary/10",
                  location.pathname === item.path && "bg-primary/10 text-primary"
                )}
                onClick={() => navigate(item.path)}
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden md:flex hover:bg-primary/10 border-primary/20"
              onClick={handleAddRecipe}
            >
              <ChefHat className="w-4 h-4 mr-2" />
              Submit Recipe
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="hover:bg-primary/10"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => supabase.auth.signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                className="bg-primary hover:bg-primary-600"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}