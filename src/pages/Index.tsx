import { useState, useEffect } from "react";
import { EmotionSelector } from "@/components/EmotionSelector";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeList } from "@/components/RecipeList";
import { RecipeSubmissionForm } from "@/components/RecipeSubmissionForm";
import { Button } from "@/components/ui/button";
import { ChefHat, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="min-h-screen bg-background">
      <header className="py-6 px-4 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MoodChef</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleSubmitRecipe}
              className="hidden sm:flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Submit Recipe
            </Button>
            {user ? (
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {showSubmissionForm ? (
          <>
            <Button
              variant="ghost"
              onClick={() => setShowSubmissionForm(false)}
              className="mb-4"
            >
              ← Back to Recipes
            </Button>
            <RecipeSubmissionForm />
          </>
        ) : (
          <>
            <EmotionSelector
              selectedEmotions={selectedEmotions}
              onEmotionSelect={handleEmotionSelect}
            />
            <IngredientInput
              ingredients={ingredients}
              onIngredientsChange={setIngredients}
            />
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90"
                disabled={selectedEmotions.length === 0}
                onClick={() => setShowRecipes(true)}
              >
                Find Recipes
              </Button>
            </div>
            {showRecipes && (
              <RecipeList
                selectedEmotions={selectedEmotions}
                ingredients={ingredients}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;