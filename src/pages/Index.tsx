import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CookingPot, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RecipeList } from "@/components/RecipeList";
import { RecipeSubmissionForm } from "@/components/RecipeSubmissionForm";
import { Features } from "@/components/home/Features";
import { RecipeForm } from "@/components/home/RecipeForm";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          setUser(null);
          return;
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

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
              
              <RecipeForm />

              <Features onSubmitRecipe={() => setShowSubmissionForm(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
