import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Trophy, Medal, Crown } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export function BattleLeaderboard() {
  const { data: topChefs } = useQuery({
    queryKey: ['topChefs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('battle_submissions')
        .select(`
          votes,
          user:profiles(id, username, avatar_url),
          recipe:recipes(title)
        `)
        .order('votes', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Trophy className="w-5 h-5 text-primary/40" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Star className="w-6 h-6 text-primary" />
          Battle Champions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {topChefs?.map((submission, index) => (
            <motion.div
              key={submission.user.id}
              variants={item}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <div className="flex-shrink-0 w-8">
                {getRankIcon(index)}
              </div>
              
              <Avatar className="border-2 border-primary/20">
                <AvatarImage src={submission.user.avatar_url} />
                <AvatarFallback className="bg-primary/10">
                  {submission.user.username?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{submission.user.username}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {submission.recipe.title}
                </p>
              </div>

              <div className="flex items-center gap-1 text-secondary">
                <Star className="w-4 h-4" />
                <span className="font-medium">{submission.votes || 0}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}