import { formatDistanceToNow } from "date-fns";
import { Trophy, ChefHat, Calendar } from "lucide-react";
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
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="mb-2">
              {battle.battle_type === 'speed_run' ? '⚡ Speed Run' : 
               battle.battle_type === 'mystery_box' ? '🎁 Mystery Box' : 
               '🏆 Classic'}
            </Badge>
            <Badge variant="outline" className="mb-2">
              <Calendar className="w-3 h-3 mr-1" />
              {timeLeft}
            </Badge>
          </div>
          <CardTitle className="text-xl">{battle.title}</CardTitle>
          <CardDescription>{battle.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between space-y-4">
          {battle.theme_ingredients && battle.theme_ingredients.length > 0 && (
            <div>
              <p className="font-medium mb-2">Featured Ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {battle.theme_ingredients.map((ingredient: string) => (
                  <Badge key={ingredient} variant="secondary">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                <span>{submissionCount} submissions</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>{battle.prize_description}</span>
              </div>
            </div>

            <Button 
              onClick={onSubmit}
              className="w-full"
            >
              Submit Your Recipe
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}