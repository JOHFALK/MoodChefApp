import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./navigation/Logo";
import { NavItems } from "./navigation/NavItems";
import { AuthButtons } from "./navigation/AuthButtons";

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
      
      if (event === 'SIGNED_OUT') {
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
      setUser(null);
      navigate("/login");
      toast({
        title: "Signed out",
        description: "You have been signed out of your account.",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <NavItems />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden md:flex hover-lift border-primary/20 group"
              onClick={handleAddRecipe}
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary group-hover:animate-pulse" />
              Submit Recipe
            </Button>
            <AuthButtons user={user} onSignOut={handleSignOut} />
          </div>
        </div>
      </div>
    </header>
  );
}