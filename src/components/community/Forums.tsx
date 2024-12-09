import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { CategoryList } from "./forum/CategoryList";
import { Input } from "@/components/ui/input";
import { 
  Search, TrendingUp, Clock, Star, Flame, 
  ThumbsUp, MessageSquare, Heart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Forums() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "trending" | "popular">("trending");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["forumCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_categories")
        .select(`
          *,
          forum_topics (
            id,
            title,
            created_at,
            user_id,
            views,
            emotions,
            has_recipe,
            forum_replies(count)
          )
        `)
        .order("created_at", { foreignTable: "forum_topics", ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleNewTopic = (categoryId: string, isPremium: boolean) => {
    if (isPremium) {
      toast({
        title: "Premium Feature",
        description: "This category is for premium members only. Upgrade to access exclusive content!",
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }
    navigate(`/community/new-topic/${categoryId}`);
  };

  const filteredCategories = categories?.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSortedCategories = () => {
    if (!filteredCategories) return [];
    
    switch (sortBy) {
      case "trending":
        return [...filteredCategories].sort((a, b) => 
          (b.forum_topics?.length || 0) - (a.forum_topics?.length || 0)
        );
      case "latest":
        return [...filteredCategories].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "popular":
        return [...filteredCategories].sort((a, b) => {
          const aViews = a.forum_topics?.reduce((sum, topic) => sum + (topic.views || 0), 0) || 0;
          const bViews = b.forum_topics?.reduce((sum, topic) => sum + (topic.views || 0), 0) || 0;
          return bViews - aViews;
        });
      default:
        return filteredCategories;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
      </div>

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

      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="emotion">Emotion-Based</TabsTrigger>
          <TabsTrigger value="interest">Interest-Based</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <CategoryList 
            categories={getSortedCategories()} 
            onNewTopic={handleNewTopic} 
            filter="all" 
          />
        </TabsContent>

        <TabsContent value="emotion" className="mt-6">
          <CategoryList 
            categories={getSortedCategories()} 
            onNewTopic={handleNewTopic} 
            filter="emotion" 
          />
        </TabsContent>

        <TabsContent value="interest" className="mt-6">
          <CategoryList 
            categories={getSortedCategories()} 
            onNewTopic={handleNewTopic} 
            filter="interest" 
          />
        </TabsContent>

        <TabsContent value="premium" className="mt-6">
          <CategoryList 
            categories={getSortedCategories()} 
            onNewTopic={handleNewTopic} 
            filter="premium" 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}