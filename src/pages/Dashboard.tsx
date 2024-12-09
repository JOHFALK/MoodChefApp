import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AdminControls } from "@/components/dashboard/AdminControls";
import { BattleManager } from "@/components/dashboard/battle/BattleManager";
import { UserManagement } from "@/components/dashboard/UserManagement";
import { MoodAnalytics } from "@/components/dashboard/MoodAnalytics";
import { WelcomeMessage } from "@/components/dashboard/WelcomeMessage";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [summary, setSummary] = useState({
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
        checkAdminStatus(session.user.id);
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

  const checkAdminStatus = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    setIsAdmin(profile?.is_admin || false);
  };

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
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <DashboardHeader userEmail={user?.email} onSignOut={handleSignOut} />
      
      <main className="container py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeMessage userName={user?.email?.split('@')[0] || 'Chef'} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-6 md:grid-cols-3"
        >
          <StatCards summary={summary} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <QuickActions />
        </motion.div>

        {isAdmin && (
          <div className="space-y-8">
            <AdminControls />
            <BattleManager />
            <UserManagement />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MoodAnalytics />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <RecentActivity recentRecipes={recentRecipes} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <NotificationCenter />
        </motion.div>
      </main>
    </div>
  );
}