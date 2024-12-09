import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Crown, PlusCircle, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
}

export function CategoryCard({ category, onNewTopic }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div layout>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            {category.is_premium ? (
              <Crown className="h-5 w-5 text-yellow-500" />
            ) : (
              <MessageSquare className="h-5 w-5 text-primary" />
            )}
            <div className="flex flex-col">
              <CardTitle className="text-xl">{category.name}</CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant={category.category_type === "emotion" ? "default" : "secondary"}>
                  {category.category_type}
                </Badge>
                {category.is_premium && (
                  <Badge variant="premium">Premium</Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onNewTopic(category.id, category.is_premium)}
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
                  <div className="flex flex-col">
                    <span className="text-sm group-hover:text-primary transition-colors">
                      {topic.title}
                    </span>
                    {topic.emotions?.length > 0 && (
                      <div className="flex gap-1">
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
  );
}