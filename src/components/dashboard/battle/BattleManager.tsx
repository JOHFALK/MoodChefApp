import { useState } from "react";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BattleForm } from "./BattleForm";
import { BattleList } from "./BattleList";
import { motion } from "framer-motion";

export function BattleManager() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const { data: battles, refetch } = useQuery({
    queryKey: ['admin-battles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipe_battles')
        .select(`
          *,
          battle_submissions (
            id,
            recipe:recipes(title)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleCreateBattle = async (battleData: any) => {
    try {
      setIsCreating(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(battleData.duration_days));

      const { error } = await supabase
        .from('recipe_battles')
        .insert({
          creator_id: user.id,
          title: battleData.title,
          description: battleData.description,
          target_mood: battleData.target_mood,
          theme_ingredients: battleData.theme_ingredients.split(',').map((i: string) => i.trim()),
          battle_type: battleData.battle_type,
          prize_description: battleData.prize_description,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Battle created!",
        description: "The new battle has been created successfully.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error creating battle:', error);
      toast({
        title: "Error",
        description: "Could not create the battle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary animate-pulse" />
            <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Battle Management
            </CardTitle>
          </div>
          <CardDescription>
            Create and manage cooking battles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end">
              <BattleForm isCreating={isCreating} onCreateBattle={handleCreateBattle} />
            </div>
            <BattleList battles={battles} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}