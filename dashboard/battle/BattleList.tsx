import { format } from "date-fns";
import { Calendar, ChefHat, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Battle {
  id: string;
  title: string;
  description: string;
  end_date: string;
  battle_type: string;
  battle_submissions?: any[];
}

interface BattleListProps {
  battles: Battle[];
}

export function BattleList({ battles }: BattleListProps) {
  return (
    <div className="space-y-4">
      {battles?.map((battle, index) => (
        <motion.div
          key={battle.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-4 hover:shadow-lg transition-all duration-300 bg-white/95 backdrop-blur-sm border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {battle.title}
                </h3>
                <p className="text-sm text-muted-foreground">{battle.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="bg-primary/5 border-primary/20">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(battle.end_date), 'MMM d, yyyy')}
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/5 border-secondary/20">
                    <ChefHat className="w-3 h-3 mr-1" />
                    {battle.battle_submissions?.length || 0} submissions
                  </Badge>
                  <Badge variant="outline" className="bg-accent/5 border-accent/20">
                    <Timer className="w-3 h-3 mr-1" />
                    {battle.battle_type}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary/20 hover:bg-primary/5"
              >
                Manage
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}