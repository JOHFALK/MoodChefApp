import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Logo } from "./navigation/Logo";
import { NavItems } from "./navigation/NavItems";
import { AuthButtons } from "./navigation/AuthButtons";
import { useSession } from "@/hooks/use-session";

export function Navigation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSession();

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
        toast({
          title: "Error signing out",
          description: "An error occurred while signing out.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out.",
        variant: "destructive",
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