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
      gradient: "from-primary-400 to-primary-600",
      iconColor: "text-primary-600",
    },
    {
      title: "Favorite Time to Cook",
      value: summary.favoriteTimeOfDay,
      icon: Clock,
      gradient: "from-secondary-400 to-secondary-600",
      iconColor: "text-secondary-600",
    },
    {
      title: "Most Common Mood",
      value: summary.mostCookedEmotion,
      icon: TrendingUp,
      gradient: "from-accent to-accent-foreground",
      iconColor: "text-accent",
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="w-full"
        >
          <Card className="hover:shadow-lg transition-all duration-300 bg-white/95 backdrop-blur-sm border border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient} bg-opacity-10`}>
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
    </>
  );
}