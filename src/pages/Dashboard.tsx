import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CookingPatternChart } from "@/components/CookingPatternChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        fetchRecentActivity(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchRecentActivity = async (userId: string) => {
    try {
      const { data: interactions, error } = await supabase
        .from("recipe_interactions")
        .select(`
          *,
          recipes (
            title,
            emotions
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentRecipes(interactions || []);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        duration: 2000,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error signing out",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 px-4 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MoodChef</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Cooking Patterns</CardTitle>
              <CardDescription>
                See when you cook most frequently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CookingPatternChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest cooking adventures
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentRecipes.length > 0 ? (
                <div className="space-y-4">
                  {recentRecipes.map((interaction) => (
                    <div
                      key={interaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{interaction.recipes.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Cooked during the {interaction.time_of_day}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {interaction.recipes.emotions.map((emotion: string) => (
                          <span
                            key={emotion}
                            className="px-2 py-1 text-xs bg-primary/10 rounded-full"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Start cooking to see your activity here!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}