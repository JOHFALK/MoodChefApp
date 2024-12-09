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
        <ForumSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <ForumActions sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <ForumFilters />

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