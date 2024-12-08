import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChefHat, Calendar, Clock, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CookingPatternChart } from "@/components/CookingPatternChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CookingSummary {
  totalRecipes: number;
  favoriteTimeOfDay: string;
  mostCookedEmotion: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [summary, setSummary] = useState<CookingSummary>({
    totalRecipes: 0,
    favoriteTimeOfDay: '',
    mostCookedEmotion: '',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        fetchRecentActivity(session.user.id);
        fetchCookingSummary(session.user.id);
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

  const fetchCookingSummary = async (userId: string) => {
    try {
      const { data: interactions } = await supabase
        .from("recipe_interactions")
        .select(`
          time_of_day,
          emotions
        `)
        .eq("user_id", userId);

      if (interactions) {
        // Calculate total recipes
        const totalRecipes = interactions.length;

        // Calculate favorite time of day
        const timeCount: Record<string, number> = {};
        interactions.forEach(i => {
          timeCount[i.time_of_day] = (timeCount[i.time_of_day] || 0) + 1;
        });
        const favoriteTimeOfDay = Object.entries(timeCount)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

        // Calculate most cooked emotion
        const emotionCount: Record<string, number> = {};
        interactions.forEach(i => {
          i.emotions.forEach((emotion: string) => {
            emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
          });
        });
        const mostCookedEmotion = Object.entries(emotionCount)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

        setSummary({
          totalRecipes,
          favoriteTimeOfDay,
          mostCookedEmotion,
        });
      }
    } catch (error) {
      console.error("Error fetching cooking summary:", error);
    }
  };

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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recipes Cooked</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalRecipes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Time to Cook</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{summary.favoriteTimeOfDay}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Common Mood</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.mostCookedEmotion}</div>
            </CardContent>
          </Card>
        </div>

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
                        {interaction.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Note: {interaction.notes}
                          </p>
                        )}
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