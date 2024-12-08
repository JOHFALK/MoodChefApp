import { useState, useEffect } from "react";
import { EmotionSelector } from "@/components/EmotionSelector";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeList } from "@/components/RecipeList";
import { RecipeSubmissionForm } from "@/components/RecipeSubmissionForm";
import { Button } from "@/components/ui/button";
import { ChefHat, Plus, Home, Search, User, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    <div className="min-h-screen bg-background relative pb-16">
      {/* Header with slide-out menu */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary animate-float" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MoodChef
            </h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="space-y-4 mt-8">
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSubmitRecipe}
                    >
                      Submit Recipe
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
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
      <main className="container pt-20 pb-8 space-y-8 max-w-5xl mx-auto px-4">
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
                className="bg-primary text-white hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t z-50">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <Button variant="ghost" className="flex-col gap-1" onClick={() => setShowSubmissionForm(false)}>
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex-col gap-1" onClick={() => setShowRecipes(true)}>
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col gap-1 relative"
            onClick={handleSubmitRecipe}
          >
            <div className="absolute -top-6 bg-primary rounded-full p-3 shadow-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs mt-4">Add</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col gap-1"
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