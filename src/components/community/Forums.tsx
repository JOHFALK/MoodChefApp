import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { CategoryList } from "./forum/CategoryList";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Forums() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="h-4 w-4" />
            Latest
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Star className="h-4 w-4" />
            Featured
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="emotion">Emotion-Based</TabsTrigger>
          <TabsTrigger value="interest">Interest-Based</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <CategoryList categories={filteredCategories} onNewTopic={handleNewTopic} filter="all" />
        </TabsContent>

        <TabsContent value="emotion" className="mt-6">
          <CategoryList categories={filteredCategories} onNewTopic={handleNewTopic} filter="emotion" />
        </TabsContent>

        <TabsContent value="interest" className="mt-6">
          <CategoryList categories={filteredCategories} onNewTopic={handleNewTopic} filter="interest" />
        </TabsContent>

        <TabsContent value="premium" className="mt-6">
          <CategoryList categories={filteredCategories} onNewTopic={handleNewTopic} filter="premium" />
        </TabsContent>
      </Tabs>
    </div>
  );
}