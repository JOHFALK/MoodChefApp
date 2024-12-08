import { Calendar, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface CookingSummary {
  totalRecipes: number;
  favoriteTimeOfDay: string;
  mostCookedEmotion: string;
}

interface StatCardsProps {
  summary: CookingSummary;
}

export function StatCards({ summary }: StatCardsProps) {
  const cards = [
    {
      title: "Total Recipes Cooked",
      value: summary.totalRecipes,
      icon: Calendar,
      color: "from-primary-400/20 to-primary-600/20",
      textColor: "text-primary-700",
    },
    {
      title: "Favorite Time to Cook",
      value: summary.favoriteTimeOfDay,
      icon: Clock,
      color: "from-secondary-400/20 to-secondary-600/20",
      textColor: "text-secondary-800",
    },
    {
      title: "Most Common Mood",
      value: summary.mostCookedEmotion,
      icon: TrendingUp,
      color: "from-accent/20 to-accent/30",
      textColor: "text-accent",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br border-0 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <card.icon className={`w-8 h-8 ${card.textColor}`} />
                <div className={`text-2xl font-bold ${card.textColor}`}>
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {card.title}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}