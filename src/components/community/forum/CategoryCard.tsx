import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Crown, PlusCircle, Users, ChevronRight, Eye, MessageCircle, Heart, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string | null;
    is_premium: boolean;
    category_type: string;
    icon: string | null;
    forum_topics?: {
      id: string;
      title: string;
      created_at: string;
      user_id: string;
      views: number;
      emotions: string[];
      has_recipe: boolean;
      forum_replies: { count: number }[];
    }[];
  };
  onNewTopic: (categoryId: string, isPremium: boolean) => void;
  isPremium?: boolean;
}

export function CategoryCard({ category, onNewTopic, isPremium }: CategoryCardProps) {
  const navigate = useNavigate();

  const getTopicStats = (topic: CategoryCardProps["category"]["forum_topics"][0]) => {
    return {
      views: topic.views || 0,
      replies: topic.forum_replies[0]?.count || 0,
    };
  };

  const getCategoryIcon = () => {
    if (category.is_premium) return <Crown className="h-5 w-5 text-yellow-500" />;
    switch (category.category_type) {
      case "emotion":
        return <Heart className="h-5 w-5 text-rose-500" />;
      case "interest":
        return <Globe className="h-5 w-5 text-blue-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-primary" />;
    }
  };

  const getCategoryBadgeVariant = () => {
    if (category.is_premium) return "premium";
    switch (category.category_type) {
      case "emotion":
        return "default";
      case "interest":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleNewTopic = () => {
    if (!isPremium && category.is_premium) {
      navigate("/pricing");
      return;
    }
    navigate(`/community/new-topic/${category.id}`);
  };

  return (
    <motion.div layout>
      <Card className={cn(
        "hover:shadow-lg transition-shadow duration-300",
        category.is_premium && !isPremium && "relative"
      )}>
        {category.is_premium && !isPremium && (
          <div className="absolute inset-0 backdrop-blur-[2px] bg-background/50 z-10 flex items-center justify-center">
            <div className="text-center p-4">
              <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">Premium Category</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Upgrade to access premium content
              </p>
              <Button 
                size="sm" 
                onClick={() => navigate("/pricing")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            {getCategoryIcon()}
            <div className="flex flex-col">
              <CardTitle className="text-xl">{category.name}</CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant={getCategoryBadgeVariant()}>
                  {category.category_type}
                </Badge>
                {category.is_premium && (
                  <Badge variant="premium">Premium</Badge>
                )}
              </div>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleNewTopic}
                >
                  <PlusCircle className="h-4 w-4" />
                  New Topic
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{!isPremium && category.is_premium ? "Premium members only" : "Start a new discussion"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">{category.description}</CardDescription>
          <div className="space-y-2">
            {category.forum_topics?.slice(0, 3).map((topic) => {
              const stats = getTopicStats(topic);
              return (
                <motion.div
                  key={topic.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/10 cursor-pointer group"
                  onClick={() => navigate(`/community/topic/${topic.id}`)}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm group-hover:text-primary transition-colors truncate">
                        {topic.title}
                      </span>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{format(new Date(topic.created_at), 'MMM d')}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {stats.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {stats.replies}
                        </div>
                      </div>
                      {topic.emotions?.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {topic.emotions.map((emotion, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              );
            })}
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
  );
}
