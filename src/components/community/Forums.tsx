import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { CategoryList } from "./forum/CategoryList";

export function Forums() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");

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
    toast({
      title: "Coming Soon",
      description: "New topic creation will be available soon!",
    });
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
      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="emotion">Emotion-Based</TabsTrigger>
          <TabsTrigger value="interest">Interest-Based</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <CategoryList categories={categories} onNewTopic={handleNewTopic} filter="all" />
        </TabsContent>

        <TabsContent value="emotion" className="mt-6">
          <CategoryList categories={categories} onNewTopic={handleNewTopic} filter="emotion" />
        </TabsContent>

        <TabsContent value="interest" className="mt-6">
          <CategoryList categories={categories} onNewTopic={handleNewTopic} filter="interest" />
        </TabsContent>

        <TabsContent value="premium" className="mt-6">
          <CategoryList categories={categories} onNewTopic={handleNewTopic} filter="premium" />
        </TabsContent>
      </Tabs>
    </div>
  );
}