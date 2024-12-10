import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, Menu, Trophy, Users, Sparkles } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          setUser(null);
          if (location.pathname !== '/login') {
            navigate('/login');
          }
          return;
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
        if (location.pathname !== '/login') {
          navigate('/login');
          toast({
            title: "Session ended",
            description: "Please sign in again to continue.",
          });
        }
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

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

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        // Even if sign out fails, clear local state
        setUser(null);
        navigate("/login");
        toast({
          title: "Signed out",
          description: "You have been signed out of your account.",
        });
        return;
      }
      
      navigate("/login");
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear local state and redirect
      setUser(null);
      navigate("/login");
      toast({
        title: "Signed out",
        description: "You have been signed out of your account.",
      });
    }
  };

  const navItems = [
    { label: "Explore", path: "/" },
    { 
      label: "Battles", 
      path: "/battles",
      icon: Trophy,
      description: "Join cooking challenges"
    },
    { 
      label: "Community", 
      path: "/community",
      icon: Users,
      description: "Share stories & photos"
    },
    { label: "Pricing", path: "/pricing" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <ChefHat className="w-7 h-7 text-primary animate-float" />
              <motion.div
                className="absolute -inset-1 bg-primary/20 rounded-full -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">
              MoodChef
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "nav-item text-sm font-medium",
                  location.pathname === item.path && "bg-primary/10 text-primary"
                )}
                onClick={() => navigate(item.path)}
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden md:flex hover-lift border-primary/20 group"
              onClick={handleAddRecipe}
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary group-hover:animate-pulse" />
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
                <DropdownMenuContent align="end" className="w-48 glass-card">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                className="button-gradient shine-effect"
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
