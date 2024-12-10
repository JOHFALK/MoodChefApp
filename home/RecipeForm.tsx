import { useState } from "react";
import { EmotionSelector } from "@/components/EmotionSelector";
import { IngredientInput } from "@/components/IngredientInput";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface RecipeFormProps {
  onSearch: (emotions: string[], ingredients: string[]) => void;
}

export function RecipeForm({ onSearch }: RecipeFormProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleEmotionSelect = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else if (selectedEmotions.length < 2) {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleSearch = () => {
    console.log("Searching with:", { selectedEmotions, ingredients });
    onSearch(selectedEmotions, ingredients);
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
          onClick={handleSearch}
        >
          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
          Find Your Perfect Recipe
        </Button>
      </motion.div>
    </motion.div>
  );
}