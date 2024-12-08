import { useState, useEffect } from "react";
import { EmotionSelector } from "@/components/EmotionSelector";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeList } from "@/components/RecipeList";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

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

  const handleFindRecipes = () => {
    setShowRecipes(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 px-4 border-b">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MoodChef</h1>
          </div>
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
      </header>

      <main className="container py-8 space-y-8">
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
            onClick={handleFindRecipes}
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
      </main>
    </div>
  );
}

export default Index;