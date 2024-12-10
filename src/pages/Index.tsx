import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { GamificationDisplay } from "@/components/home/GamificationDisplay";
import { EmotionSelector } from "@/components/EmotionSelector";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

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
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-16">
      <Hero onSubmitRecipe={handleSubmitRecipe} />
      <EmotionSelector 
        selectedEmotions={selectedEmotions}
        onEmotionSelect={handleEmotionSelect}
      />
      <Features onSubmitRecipe={handleSubmitRecipe} />
      <GamificationDisplay />
    </main>
  );
}