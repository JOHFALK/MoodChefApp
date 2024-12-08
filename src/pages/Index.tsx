import { useState, useEffect } from "react";
import { EmotionSelector } from "@/components/EmotionSelector";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeList } from "@/components/RecipeList";
import { RecipeSubmissionForm } from "@/components/RecipeSubmissionForm";
import { Button } from "@/components/ui/button";
import { ChefHat, Plus, Home, Search, User, Menu, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-background relative pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <ChefHat className="w-8 h-8 text-primary animate-float" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MoodChef
            </h1>
          </motion.div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="space-y-4 mt-8">
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full bg-primary/5 hover:bg-primary/10 border-primary/20"
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-secondary/5 hover:bg-secondary/10 border-secondary/20"
                      onClick={handleSubmitRecipe}
                    >
                      Submit Recipe
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full bg-primary/5 hover:bg-primary/10 border-primary/20"
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="container pt-24 pb-8 space-y-8 max-w-5xl mx-auto px-4">
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
                className="mb-4 hover:bg-primary/10"
              >
                ← Back to Recipes
              </Button>
              <RecipeSubmissionForm />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
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
                transition={{ delay: 0.2 }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:transform-none"
                  disabled={selectedEmotions.length === 0}
                  onClick={() => setShowRecipes(true)}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Find Perfect Recipes
                </Button>
              </motion.div>
              {showRecipes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <RecipeList
                    selectedEmotions={selectedEmotions}
                    ingredients={ingredients}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-primary/10 z-50">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <Button 
            variant="ghost" 
            className="flex-col gap-1 hover:bg-primary/10" 
            onClick={() => setShowSubmissionForm(false)}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col gap-1 hover:bg-primary/10" 
            onClick={() => setShowRecipes(true)}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col gap-1 relative hover:bg-transparent"
            onClick={handleSubmitRecipe}
          >
            <div className="absolute -top-6 bg-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs mt-4">Add</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col gap-1 hover:bg-primary/10"
            onClick={() => navigate(user ? "/dashboard" : "/login")}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">{user ? "Profile" : "Sign In"}</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Index;