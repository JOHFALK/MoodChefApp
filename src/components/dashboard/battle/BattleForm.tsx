import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface BattleFormProps {
  isCreating: boolean;
  onCreateBattle: (battleData: any) => Promise<void>;
}

export function BattleForm({ isCreating, onCreateBattle }: BattleFormProps) {
  const [newBattle, setNewBattle] = useState({
    title: "",
    description: "",
    target_mood: "",
    theme_ingredients: "",
    battle_type: "classic",
    prize_description: "",
    duration_days: "7",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Trophy className="w-4 h-4 mr-2" />
          Create Battle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-lg border border-primary/20">
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
              className="border-primary/20"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newBattle.description}
              onChange={(e) => setNewBattle(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Create the most refreshing summer dessert..."
              className="border-primary/20"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="target_mood">Target Mood</Label>
            <Input
              id="target_mood"
              value={newBattle.target_mood}
              onChange={(e) => setNewBattle(prev => ({ ...prev, target_mood: e.target.value }))}
              placeholder="refreshing"
              className="border-primary/20"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="theme_ingredients">Theme Ingredients (comma-separated)</Label>
            <Input
              id="theme_ingredients"
              value={newBattle.theme_ingredients}
              onChange={(e) => setNewBattle(prev => ({ ...prev, theme_ingredients: e.target.value }))}
              placeholder="strawberries, mint, lime"
              className="border-primary/20"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="battle_type">Battle Type</Label>
            <select
              id="battle_type"
              className="flex h-10 w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-sm"
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
              className="border-primary/20"
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
              className="border-primary/20"
            />
          </div>
        </div>
        <Button 
          onClick={() => onCreateBattle(newBattle)} 
          disabled={isCreating}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          {isCreating ? "Creating..." : "Create Battle"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}