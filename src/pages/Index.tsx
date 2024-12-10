import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { GamificationDisplay } from "@/components/home/GamificationDisplay";
import { EmotionSelector } from "@/components/EmotionSelector";
import { RecipeList } from "@/components/RecipeList";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

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

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotion)) {
        return prev.filter(e => e !== emotion);
      }
      if (prev.length < 2) {
        return [...prev, emotion];
      }
      return prev;
    });
    setShowResults(true);
  };

  const handleSearch = (emotions: string[], searchIngredients: string[]) => {
    setSelectedEmotions(emotions);
    setIngredients(searchIngredients);
    setShowResults(true);
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-16">
      <Hero onSubmitRecipe={handleSubmitRecipe} />
      <EmotionSelector 
        selectedEmotions={selectedEmotions}
        onEmotionSelect={handleEmotionSelect}
      />
      {showResults && (
        <RecipeList 
          selectedEmotions={selectedEmotions}
          ingredients={ingredients}
        />
      )}
      <Features onSubmitRecipe={handleSubmitRecipe} />
      <GamificationDisplay />
    </main>
  );
}