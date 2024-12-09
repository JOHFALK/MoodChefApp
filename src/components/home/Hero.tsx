import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onSubmitRecipe: () => void;
}

export function Hero({ onSubmitRecipe }: HeroProps) {
  return (
    <div className="text-center space-y-4">
      <motion.h1 
        className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Find Recipes for Your Mood
      </motion.h1>
      <motion.p 
        className="text-lg text-foreground/80 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Select your emotions and ingredients to discover perfectly matched recipes
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={onSubmitRecipe}
          className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all duration-300 
                   shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
          Submit Your Recipe
        </Button>
      </motion.div>
    </div>
  );
}