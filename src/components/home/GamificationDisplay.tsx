import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Trophy, Award, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Achievement {
  achievement_type: string;
  achievement_data: {
    count?: number;
    date: string;
  };
  created_at: string;
}

interface Profile {
  badges: string[];
  mood_points: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function GamificationDisplay() {
  const { toast } = useToast();

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('badges, mood_points')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  const { data: achievements } = useQuery({
    queryKey: ['userAchievements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Achievement[];
    },
  });

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'battle_winner':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'battle_master':
        return <Trophy className="w-6 h-6 text-purple-500" />;
      case 'recipe_creator':
        return <Star className="w-6 h-6 text-blue-500" />;
      default:
        return <Award className="w-6 h-6 text-primary" />;
    }
  };

  const getAchievementTitle = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!userProfile || !achievements) return null;

  return (
    <section className="py-12 bg-gradient-to-br from-background to-secondary/5">
      <div className="container">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Achievements
            </h2>
            <p className="text-muted-foreground mt-2">
              Mood Points: {userProfile.mood_points || 0}
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Badges Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Badges
                </CardTitle>
                <CardDescription>
                  Special recognition for your accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {(userProfile.badges || []).map((badge, index) => (
                    <motion.div
                      key={badge + index}
                      variants={item}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-primary/5"
                    >
                      {getBadgeIcon(badge)}
                      <span className="text-sm font-medium text-center">
                        {getAchievementTitle(badge)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>
                  Your latest culinary accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.created_at}
                      variants={item}
                      className="flex items-center gap-4 p-3 rounded-lg bg-primary/5"
                    >
                      <Star className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">
                          {getAchievementTitle(achievement.achievement_type)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {achievement.achievement_data.count
                            ? `Completed ${achievement.achievement_data.count} items`
                            : new Date(achievement.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}