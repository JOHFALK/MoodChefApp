import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { GamificationDisplay } from "@/components/home/GamificationDisplay";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitRecipe = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a recipe",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    navigate("/submit-recipe");
  };

  return (
    <main>
      <Hero onSubmitRecipe={handleSubmitRecipe} />
      <Features onSubmitRecipe={handleSubmitRecipe} />
      <GamificationDisplay />
    </main>
  );
}