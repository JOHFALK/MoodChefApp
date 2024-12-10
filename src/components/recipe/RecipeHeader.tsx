import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface RecipeHeaderProps {
  title: string;
  emotions: string[];
  isPremium: boolean;
}

export function RecipeHeader({ title, emotions, isPremium }: RecipeHeaderProps) {
  return (
    <CardHeader className="space-y-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
        {isPremium && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Premium
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {emotions.map((emotion) => (
          <Badge key={emotion} variant="outline">
            {emotion}
          </Badge>
        ))}
      </div>
    </CardHeader>
  );
}