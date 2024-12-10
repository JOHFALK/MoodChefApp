import { Badge } from "@/components/ui/badge";
import { Star, Flame, Clock, ThumbsUp, Filter } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ForumFiltersProps {
  selectedFilter: string | null;
  setSelectedFilter: (filter: string | null) => void;
}

export function ForumFilters({ selectedFilter, setSelectedFilter }: ForumFiltersProps) {
  const handleFilterClick = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <Badge
          variant={selectedFilter === "Recipe Hacks & Meal Ideas" ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10"
          onClick={() => handleFilterClick("Recipe Hacks & Meal Ideas")}
        >
          <Star className="h-3 w-3 mr-1" />
          Recipe Hacks
        </Badge>
        <Badge
          variant={selectedFilter === "Cooking Tips for Beginners" ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10"
          onClick={() => handleFilterClick("Cooking Tips for Beginners")}
        >
          <Clock className="h-3 w-3 mr-1" />
          Beginner Tips
        </Badge>
        <Badge
          variant={selectedFilter === "Food Science & Mood Nutrition" ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10"
          onClick={() => handleFilterClick("Food Science & Mood Nutrition")}
        >
          <ThumbsUp className="h-3 w-3 mr-1" />
          Food Science
        </Badge>
        <Badge
          variant={selectedFilter === "Calm Corner" ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10"
          onClick={() => handleFilterClick("Calm Corner")}
        >
          <Flame className="h-3 w-3 mr-1" />
          Calm Corner
        </Badge>
        <Badge
          variant={selectedFilter === "Energizing Energy Hub" ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10"
          onClick={() => handleFilterClick("Energizing Energy Hub")}
        >
          <Filter className="h-3 w-3 mr-1" />
          Energy Hub
        </Badge>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}