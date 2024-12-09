import { Button } from "@/components/ui/button";
import { MessageSquare, Flame, Clock, ThumbsUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ForumActionsProps {
  sortBy: "trending" | "latest" | "popular";
  setSortBy: (sort: "trending" | "latest" | "popular") => void;
}

export function ForumActions({ sortBy, setSortBy }: ForumActionsProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center md:justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {sortBy === "trending" && <Flame className="h-4 w-4" />}
            {sortBy === "latest" && <Clock className="h-4 w-4" />}
            {sortBy === "popular" && <ThumbsUp className="h-4 w-4" />}
            Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setSortBy("trending")}>
            <Flame className="h-4 w-4 mr-2" />
            Trending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("latest")}>
            <Clock className="h-4 w-4 mr-2" />
            Latest
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("popular")}>
            <ThumbsUp className="h-4 w-4 mr-2" />
            Popular
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm" className="gap-2">
        <MessageSquare className="h-4 w-4" />
        New Topic
      </Button>
    </div>
  );
}