import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Sunrise, Sunset } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const quotes = [
  "Cooking is like love. It should be entered into with abandon or not at all.",
  "The only real stumbling block is fear of failure. In cooking you've got to have a what-the-hell attitude.",
  "Cooking is at once child's play and adult joy. And cooking done with care is an act of love.",
  "People who love to eat are always the best people.",
];

export function WelcomeMessage({ userName }: { userName: string }) {
  const [timeOfDay, setTimeOfDay] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay("morning");
    else if (hour >= 12 && hour < 17) setTimeOfDay("afternoon");
    else if (hour >= 17 && hour < 21) setTimeOfDay("evening");
    else setTimeOfDay("night");

    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case "morning":
        return <Sunrise className="w-6 h-6 text-yellow-500" />;
      case "afternoon":
        return <Sun className="w-6 h-6 text-orange-500" />;
      case "evening":
        return <Sunset className="w-6 h-6 text-pink-500" />;
      default:
        return <Moon className="w-6 h-6 text-indigo-500" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-background to-secondary/5 border-primary/20">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          {getTimeIcon()}
          <h2 className="text-2xl font-semibold">
            Good {timeOfDay}, {userName}!
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground italic"
        >
          "{quote}"
        </motion.p>
      </CardContent>
    </Card>
  );
}