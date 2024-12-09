import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trophy, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  const { data: recentBattles } = useQuery({
    queryKey: ['recent-battles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipe_battles')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="bg-gradient-to-br from-background to-secondary/5 border-primary/20">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/submit")}
          >
            <Heart className="w-4 h-4" />
            New Recipe
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/battles")}
          >
            <Trophy className="w-4 h-4" />
            Join Battle
          </Button>
          {notifications && notifications.length > 0 && (
            <Button
              variant="outline"
              className="flex items-center gap-2 relative"
            >
              <Bell className="w-4 h-4" />
              Notifications
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {notifications.length}
              </span>
            </Button>
          )}
        </motion.div>

        {recentBattles && recentBattles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Active Battles</h3>
            <div className="space-y-2">
              {recentBattles.map((battle) => (
                <motion.div
                  key={battle.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 bg-secondary/10 rounded-lg text-sm"
                >
                  {battle.title}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}