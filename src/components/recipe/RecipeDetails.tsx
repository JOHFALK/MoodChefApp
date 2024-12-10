import { Clock, Users, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeDetailsProps {
  cookingTime: number;
  servings: number;
  votes: number;
  hasVoted: boolean;
  onVote: (e: React.MouseEvent) => void;
}

export function RecipeDetails({ cookingTime, servings, votes, hasVoted, onVote }: RecipeDetailsProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{cookingTime} mins</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{servings} servings</span>
        </div>
      </div>
      <Button
        variant={hasVoted ? "secondary" : "outline"}
        size="sm"
        onClick={onVote}
        className="flex items-center gap-2"
      >
        <ThumbsUp className={`w-4 h-4 ${hasVoted ? "fill-current" : ""}`} />
        <span>{votes}</span>
      </Button>
    </div>
  );
}