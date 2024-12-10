import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmotionSelector } from "@/components/EmotionSelector";
import { IngredientInput } from "@/components/IngredientInput";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/use-subscription";
import { motion } from "framer-motion";

export function RecipeForm() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: subscription } = useSubscription();

  const handleEmotionSelect = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else if (selectedEmotions.length < 2) {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleSubmitRecipe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit recipes",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      if (!subscription?.isSubscribed) {
        toast({
          title: "Premium feature",
          description: "Recipe submission is available for premium users only",
          variant: "destructive",
        });
        navigate("/pricing");
        return;
      }

      setShowRecipes(true);
    } catch (error) {
      console.error('Session check error:', error);
      toast({
        title: "Authentication error",
        description: "Please try signing in again",
        variant: "destructive",
      });
      navigate("/login");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-xl p-8 space-y-8"
    >
      <EmotionSelector
        selectedEmotions={selectedEmotions}
        onEmotionSelect={handleEmotionSelect}
      />
      
      <IngredientInput
        ingredients={ingredients}
        onIngredientsChange={setIngredients}
      />

      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all duration-300
                   shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:transform-none
                   relative overflow-hidden group px-8 py-6 text-lg"
          disabled={selectedEmotions.length === 0}
          onClick={handleSubmitRecipe}
        >
          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
          Find Your Perfect Recipe
        </Button>
      </motion.div>
    </motion.div>
  );
}