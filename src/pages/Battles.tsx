import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, ChefHat, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ActiveBattleCard } from "@/components/battles/ActiveBattleCard";
import { BattleSubmissionForm } from "@/components/battles/BattleSubmissionForm";
import { BattleLeaderboard } from "@/components/battles/BattleLeaderboard";

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
    <div className="container py-8 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Recipe Battles</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compete with fellow chefs in themed cooking challenges. Win prizes and earn badges!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {battles?.map((battle) => (
            <ActiveBattleCard
              key={battle.id}
              battle={battle}
              onSubmit={() => setSelectedBattle(battle.id)}
            />
          ))}
        </div>

        {selectedBattle && (
          <BattleSubmissionForm
            battleId={selectedBattle}
            onClose={() => setSelectedBattle(null)}
          />
        )}

        <BattleLeaderboard />
      </motion.div>
    </div>
  );
}