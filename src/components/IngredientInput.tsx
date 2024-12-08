import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IngredientInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

export function IngredientInput({ ingredients, onIngredientsChange }: IngredientInputProps) {
  const [currentIngredient, setCurrentIngredient] = useState("");

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      onIngredientsChange([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(ingredients.filter((i) => i !== ingredient));
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          What ingredients do you have?
        </h2>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addIngredient()}
            placeholder="Enter an ingredient"
            className="flex-1 bg-background/50 backdrop-blur-sm border-primary/20 focus:ring-primary/30 focus:border-primary/30"
          />
          <Button 
            onClick={addIngredient} 
            variant="outline"
            className="bg-primary/10 hover:bg-primary/20 border-primary/20 transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {ingredients.map((ingredient) => (
              <motion.div
                key={ingredient}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="bg-secondary/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 group hover:bg-secondary/30 transition-colors"
              >
                <span className="text-sm">{ingredient}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeIngredient(ingredient)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}