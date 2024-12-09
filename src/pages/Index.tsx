import { useState, useEffect } from "react";
import { EmotionSelector } from "@/components/EmotionSelector";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeList } from "@/components/RecipeList";
import { RecipeSubmissionForm } from "@/components/RecipeSubmissionForm";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, CookingPot, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";

const Index = () => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { data: subscription } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEmotionSelect = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else if (selectedEmotions.length < 2) {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleSubmitRecipe = () => {
    if (!user) {
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

    setShowSubmissionForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-background via-secondary/5 to-background">
      <main className="container max-w-5xl mx-auto px-6 py-12 space-y-16">
        <AnimatePresence mode="wait">
          {showSubmissionForm ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Button
                variant="ghost"
                onClick={() => setShowSubmissionForm(false)}
                className="mb-4 hover:bg-primary/10 text-foreground group"
              >
                <span className="mr-2">←</span>
                <span className="group-hover:translate-x-1 transition-transform">Back to Recipes</span>
              </Button>
              <RecipeSubmissionForm />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              <div className="text-center space-y-6">
                <motion.div 
                  className="flex justify-center gap-4 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Heart className="w-8 h-8 text-primary animate-pulse" />
                  <CookingPot className="w-8 h-8 text-secondary animate-float" />
                  <Smile className="w-8 h-8 text-accent animate-bounce" />
                </motion.div>
                <motion.h1 
                  className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Cook for Your Mood
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Discover recipes that match your emotions and lift your spirits. Let food be your mood enhancer.
                </motion.p>
              </div>
              
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
                    onClick={() => setShowRecipes(true)}
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                    Find Your Perfect Recipe
                  </Button>
                </motion.div>
              </motion.div>

              {showRecipes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <RecipeList
                    selectedEmotions={selectedEmotions}
                    ingredients={ingredients}
                  />
                </motion.div>
              )}

              <Features onSubmitRecipe={handleSubmitRecipe} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;