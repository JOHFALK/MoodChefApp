import { Button } from "@/components/ui/button";
import { MessageSquare, Flame, Clock, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface ForumActionsProps {
  sortBy: "trending" | "latest" | "popular";
  setSortBy: (sort: "trending" | "latest" | "popular") => void;
  isPremiumCategory?: boolean;
}

export function ForumActions({ sortBy, setSortBy, isPremiumCategory = false }: ForumActionsProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex gap-2 flex-wrap justify-center md:justify-end"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary">
            {sortBy === "trending" && <Flame className="h-4 w-4 text-primary" />}
            {sortBy === "latest" && <Clock className="h-4 w-4 text-primary" />}
            {sortBy === "popular" && <ThumbsUp className="h-4 w-4 text-primary" />}
            Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass-card">
          <DropdownMenuItem onClick={() => setSortBy("trending")} className="gap-2">
            <Flame className="h-4 w-4" />
            Trending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("latest")} className="gap-2">
            <Clock className="h-4 w-4" />
            Latest
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("popular")} className="gap-2">
            <ThumbsUp className="h-4 w-4" />
            Popular
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isPremiumCategory ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-primary/20 hover:border-primary group"
            >
              <MessageSquare className="h-4 w-4 group-hover:text-primary transition-colors" />
              New Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Premium Feature</DialogTitle>
              <DialogDescription className="space-y-4 pt-4">
                <p>
                  This category is exclusive to premium members. Upgrade your account to:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Create new topics in premium categories</li>
                  <li>Access exclusive recipe content</li>
                  <li>Get personalized mood recommendations</li>
                </ul>
                <Button 
                  className="w-full mt-4"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade to Premium
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-primary/20 hover:border-primary group"
          onClick={() => navigate("/community/new-topic")}
        >
          <MessageSquare className="h-4 w-4 group-hover:text-primary transition-colors" />
          New Topic
        </Button>
      )}
    </motion.div>
  );
}