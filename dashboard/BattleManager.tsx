import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Calendar, Timer, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function BattleManager() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newBattle, setNewBattle] = useState({
    title: "",
    description: "",
    target_mood: "",
    theme_ingredients: "",
    battle_type: "classic",
    prize_description: "",
    duration_days: "7",
  });

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

  const handleCreateBattle = async () => {
    try {
      setIsCreating(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(newBattle.duration_days));

      const { error } = await supabase
        .from('recipe_battles')
        .insert({
          creator_id: user.id,
          title: newBattle.title,
          description: newBattle.description,
          target_mood: newBattle.target_mood,
          theme_ingredients: newBattle.theme_ingredients.split(',').map(i => i.trim()),
          battle_type: newBattle.battle_type,
          prize_description: newBattle.prize_description,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Battle created!",
        description: "The new battle has been created successfully.",
      });
      
      refetch();
      setNewBattle({
        title: "",
        description: "",
        target_mood: "",
        theme_ingredients: "",
        battle_type: "classic",
        prize_description: "",
        duration_days: "7",
      });
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <CardTitle>Battle Management</CardTitle>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Trophy className="w-4 h-4 mr-2" />
                Create Battle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Battle</DialogTitle>
                <DialogDescription>
                  Set up a new cooking challenge for the community
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Battle Title</Label>
                  <Input
                    id="title"
                    value={newBattle.title}
                    onChange={(e) => setNewBattle(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summer Dessert Challenge"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBattle.description}
                    onChange={(e) => setNewBattle(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Create the most refreshing summer dessert..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="target_mood">Target Mood</Label>
                  <Input
                    id="target_mood"
                    value={newBattle.target_mood}
                    onChange={(e) => setNewBattle(prev => ({ ...prev, target_mood: e.target.value }))}
                    placeholder="refreshing"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="theme_ingredients">Theme Ingredients (comma-separated)</Label>
                  <Input
                    id="theme_ingredients"
                    value={newBattle.theme_ingredients}
                    onChange={(e) => setNewBattle(prev => ({ ...prev, theme_ingredients: e.target.value }))}
                    placeholder="strawberries, mint, lime"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="battle_type">Battle Type</Label>
                  <select
                    id="battle_type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newBattle.battle_type}
                    onChange={(e) => setNewBattle(prev => ({ ...prev, battle_type: e.target.value }))}
                  >
                    <option value="classic">Classic</option>
                    <option value="speed_run">Speed Run</option>
                    <option value="mystery_box">Mystery Box</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prize_description">Prize Description</Label>
                  <Input
                    id="prize_description"
                    value={newBattle.prize_description}
                    onChange={(e) => setNewBattle(prev => ({ ...prev, prize_description: e.target.value }))}
                    placeholder="Special badge and featured on homepage"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newBattle.duration_days}
                    onChange={(e) => setNewBattle(prev => ({ ...prev, duration_days: e.target.value }))}
                    min="1"
                    max="30"
                  />
                </div>
              </div>
              <Button onClick={handleCreateBattle} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Battle"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Create and manage cooking battles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {battles?.map((battle) => (
            <Card key={battle.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{battle.title}</h3>
                  <p className="text-sm text-muted-foreground">{battle.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(battle.end_date), 'MMM d, yyyy')}
                    </Badge>
                    <Badge variant="outline">
                      <ChefHat className="w-3 h-3 mr-1" />
                      {battle.battle_submissions?.length || 0} submissions
                    </Badge>
                    <Badge variant="outline">
                      <Timer className="w-3 h-3 mr-1" />
                      {battle.battle_type}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}