import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CookingPatternChart } from "@/components/CookingPatternChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Navigation } from "@/components/Navigation";

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
        .select(`time_of_day, emotions`)
        .eq("user_id", userId);

      if (interactions) {
        const totalRecipes = interactions.length;
        const timeCount: Record<string, number> = {};
        const emotionCount: Record<string, number> = {};

        interactions.forEach(i => {
          timeCount[i.time_of_day] = (timeCount[i.time_of_day] || 0) + 1;
          i.emotions.forEach((emotion: string) => {
            emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
          });
        });

        const favoriteTimeOfDay = Object.entries(timeCount)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
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
      <DashboardHeader userEmail={user?.email} onSignOut={handleSignOut} />
      <Navigation />
      
      <main className="container py-8 space-y-8">
        <StatCards summary={summary} />

        <div className="grid gap-6">
          <Card className="hover:shadow-lg transition-shadow">
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

          <RecentActivity recentRecipes={recentRecipes} />
        </div>
      </main>
    </div>
  );
}