import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, ChefHat, Calendar, Star, Sparkles, Swords } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ActiveBattleCard } from "@/components/battles/ActiveBattleCard";
import { BattleSubmissionForm } from "@/components/battles/BattleSubmissionForm";
import { BattleLeaderboard } from "@/components/battles/BattleLeaderboard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Battles() {
  const [selectedBattle, setSelectedBattle] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: battles, isLoading } = useQuery({
    queryKey: ['battles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipe_battles')
        .select(`
          *,
          creator:profiles(username, avatar_url),
          battle_submissions(
            id,
            votes,
            recipe:recipes(title, description, emotions)
          )
        `)
        .eq('status', 'active')
        .order('end_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative">
                <Trophy className="w-16 h-16 text-primary animate-float" />
                <motion.div
                  className="absolute -inset-2 bg-primary/20 rounded-full -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Recipe Battles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compete with fellow chefs in themed cooking challenges. Show your culinary creativity and win amazing prizes!
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                variant="default"
                className="group bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                onClick={() => window.scrollTo({ top: document.getElementById('active-battles')?.offsetTop, behavior: 'smooth' })}
              >
                <Trophy className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Join Battle
              </Button>
              <Button 
                variant="outline"
                className="group border-primary/20 hover:border-primary/40"
                onClick={() => window.scrollTo({ top: document.getElementById('leaderboard')?.offsetTop, behavior: 'smooth' })}
              >
                <Star className="w-4 h-4 mr-2 text-primary group-hover:rotate-45 transition-transform" />
                View Leaderboard
              </Button>
            </div>
          </div>

          {/* Active Battles Section */}
          <section id="active-battles" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Active Battles</h2>
              <Button variant="ghost" className="text-primary">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {battles?.map((battle) => (
                <ActiveBattleCard
                  key={battle.id}
                  battle={battle}
                  onSubmit={() => setSelectedBattle(battle.id)}
                />
              ))}
            </motion.div>
          </section>

          {selectedBattle && (
            <BattleSubmissionForm
              battleId={selectedBattle}
              onClose={() => setSelectedBattle(null)}
            />
          )}

          {/* Leaderboard Section */}
          <section id="leaderboard" className="pt-12">
            <BattleLeaderboard />
          </section>
        </motion.div>
      </div>
    </div>
  );
}