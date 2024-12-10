import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoodTrendsChart } from "./MoodTrendsChart";
import { MoodInsights } from "./MoodInsights";
import { motion } from "framer-motion";

export function MoodAnalytics() {
  const { data: moodData, isLoading } = useQuery({
    queryKey: ['mood-analytics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("mood_analytics")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover:shadow-lg transition-shadow bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Mood Analytics</CardTitle>
          <CardDescription>
            Track your emotional journey and get personalized recipe recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <MoodTrendsChart data={moodData || []} />
          <MoodInsights data={moodData || []} />
        </CardContent>
      </Card>
    </motion.div>
  );
}