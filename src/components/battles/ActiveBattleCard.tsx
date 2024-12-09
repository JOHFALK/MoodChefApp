import { formatDistanceToNow } from "date-fns";
import { Trophy, ChefHat, Calendar, Users, Star, Timer } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActiveBattleCardProps {
  battle: any;
  onSubmit: () => void;
}

export function ActiveBattleCard({ battle, onSubmit }: ActiveBattleCardProps) {
  const timeLeft = formatDistanceToNow(new Date(battle.end_date), { addSuffix: true });
  const submissionCount = battle.battle_submissions?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-primary/10">
        <CardHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <Badge 
                variant="secondary" 
                className="bg-secondary/10 text-secondary-foreground"
              >
                {battle.battle_type === 'speed_run' ? '⚡ Speed Run' : 
                 battle.battle_type === 'mystery_box' ? '🎁 Mystery Box' : 
                 '🏆 Classic'}
              </Badge>
              <Badge 
                variant="outline" 
                className="bg-background/50 backdrop-blur-sm"
              >
                <Timer className="w-3 h-3 mr-1" />
                {timeLeft}
              </Badge>
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {battle.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {battle.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between space-y-4">
          {battle.theme_ingredients && battle.theme_ingredients.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-sm text-muted-foreground">Featured Ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {battle.theme_ingredients.map((ingredient: string) => (
                  <Badge 
                    key={ingredient} 
                    variant="outline"
                    className="bg-background/50 backdrop-blur-sm text-xs"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{submissionCount} entries</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-secondary" />
                <span>{battle.prize_description}</span>
              </div>
            </div>

            <Button 
              onClick={onSubmit}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 group"
            >
              <Trophy className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Submit Your Recipe
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}