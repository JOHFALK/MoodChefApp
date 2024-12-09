import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Lock, Users, Crown, PlusCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

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
            forum_replies(count)
          )
        `)
        .order("created_at", { foreignTable: "forum_topics", ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleNewTopic = (categoryId: string, isPremium: boolean) => {
    // For now, just show a toast. We'll implement the new topic page later
    if (isPremium) {
      toast({
        title: "Premium Feature",
        description: "This category is for premium members only",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Coming Soon",
      description: "New topic creation will be available soon!",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {categories?.map((category) => (
              <motion.div key={category.id} variants={item}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      {category.is_premium ? (
                        <Crown className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-primary" />
                      )}
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleNewTopic(category.id, category.is_premium)}
                    >
                      <PlusCircle className="h-4 w-4" />
                      New Topic
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{category.description}</CardDescription>
                    <div className="space-y-2">
                      {category.forum_topics?.slice(0, 3).map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/10 cursor-pointer group"
                          onClick={() => navigate(`/community/topic/${topic.id}`)}
                        >
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm group-hover:text-primary transition-colors">
                              {topic.title}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                    {category.forum_topics?.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-4 text-muted-foreground hover:text-primary"
                        onClick={() => navigate(`/community/category/${category.id}`)}
                      >
                        View all topics
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="general">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {categories
              ?.filter((category) => !category.is_premium)
              .map((category) => (
                <motion.div key={category.id} variants={item}>
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleNewTopic(category.id, category.is_premium)}
                      >
                        <PlusCircle className="h-4 w-4" />
                        New Topic
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{category.description}</CardDescription>
                      <div className="space-y-2">
                        {category.forum_topics?.slice(0, 3).map((topic) => (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/10 cursor-pointer group"
                            onClick={() => navigate(`/community/topic/${topic.id}`)}
                          >
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm group-hover:text-primary transition-colors">
                                {topic.title}
                              </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                      {category.forum_topics?.length > 3 && (
                        <Button
                          variant="ghost"
                          className="w-full mt-4 text-muted-foreground hover:text-primary"
                          onClick={() => navigate(`/community/category/${category.id}`)}
                        >
                          View all topics
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="premium">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {categories
              ?.filter((category) => category.is_premium)
              .map((category) => (
                <motion.div key={category.id} variants={item}>
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center space-x-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleNewTopic(category.id, category.is_premium)}
                      >
                        <PlusCircle className="h-4 w-4" />
                        New Topic
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{category.description}</CardDescription>
                      <div className="space-y-2">
                        {category.forum_topics?.slice(0, 3).map((topic) => (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/10 cursor-pointer group"
                            onClick={() => navigate(`/community/topic/${topic.id}`)}
                          >
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm group-hover:text-primary transition-colors">
                                {topic.title}
                              </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                      {category.forum_topics?.length > 3 && (
                        <Button
                          variant="ghost"
                          className="w-full mt-4 text-muted-foreground hover:text-primary"
                          onClick={() => navigate(`/community/category/${category.id}`)}
                        >
                          View all topics
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
