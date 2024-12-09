import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function ForumFilters() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
        All Topics
      </Badge>
      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
        Recipes
      </Badge>
      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
        Discussions
      </Badge>
      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
        Questions
      </Badge>
      <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
        Premium
        <Star className="h-3 w-3 ml-1 text-yellow-500" />
      </Badge>
    </div>
  );
}