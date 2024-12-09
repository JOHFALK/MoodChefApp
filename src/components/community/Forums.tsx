import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { CategoryList } from "./forum/CategoryList";
import { ForumSearch } from "./forum/ForumSearch";
import { ForumActions } from "./forum/ForumActions";
import { ForumFilters } from "./forum/ForumFilters";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Flame, Trending, Clock, ThumbsUp, Crown } from "lucide-react";
import { motion } from "framer-motion";

export function Forums() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "trending" | "popular">("trending");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

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

  const filteredCategories = categories?.filter(category => {
    if (searchQuery) {
      const matchesSearch = 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }
    
    if (selectedFilter) {
      return category.name === selectedFilter;
    }
    
    return true;
  });

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

  const getTrendingMoods = () => {
    if (!categories) return [];
    return categories
      .filter(cat => cat.category_type === 'emotion')
      .sort((a, b) => (b.forum_topics?.length || 0) - (a.forum_topics?.length || 0))
      .slice(0, 3);
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Trending Moods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getTrendingMoods().map((mood) => (
            <Card key={mood.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                <span className="font-medium">{mood.name}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {mood.forum_topics?.length || 0} active discussions
              </p>
            </Card>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <ForumSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <ForumActions sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <ForumFilters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />

      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px] mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="emotion">Emotions</TabsTrigger>
          <TabsTrigger value="interest">Interests</TabsTrigger>
          <TabsTrigger value="premium" className="relative">
            Premium
            <Crown className="h-4 w-4 ml-1 text-yellow-500" />
          </TabsTrigger>
          <TabsTrigger value="trending">
            <Flame className="h-4 w-4" />
          </TabsTrigger>
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

        <TabsContent value="trending" className="mt-6">
          <CategoryList 
            categories={getSortedCategories()} 
            onNewTopic={handleNewTopic} 
            filter="all"
            sortBy="trending"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}