import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Top Battle Champions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topChefs?.map((submission, index) => (
            <motion.div
              key={submission.user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-8">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}th`}
              </div>
              
              <Avatar>
                <AvatarImage src={submission.user.avatar_url} />
                <AvatarFallback>
                  {submission.user.username?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-medium">{submission.user.username}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {submission.recipe.title}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary" />
                <span>{submission.votes || 0}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}