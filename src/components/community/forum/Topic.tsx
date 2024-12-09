import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, Crown } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface TopicProfile {
  username: string;
  avatar_url: string | null;
}

interface TopicReply {
  id: string;
  content: string;
  created_at: string;
  profiles: TopicProfile;
}

interface TopicData {
  id: string;
  title: string;
  content: string;
  created_at: string;
  forum_category: {
    is_premium: boolean;
  } | null;
  profiles: TopicProfile;
  forum_replies: TopicReply[];
}

export function Topic() {
  const { topicId } = useParams();

  const { data: topic, isLoading } = useQuery({
    queryKey: ["topic", topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select(`
          id,
          title,
          content,
          created_at,
          forum_category:category_id(
            is_premium
          ),
          profiles:user_id(
            username,
            avatar_url
          ),
          forum_replies(
            id,
            content,
            created_at,
            profiles:user_id(
              username,
              avatar_url
            )
          )
        `)
        .eq("id", topicId)
        .single();

      if (error) throw error;
      return data as TopicData;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Topic not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{topic.title}</CardTitle>
              {topic.forum_category?.is_premium && (
                <Crown className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={topic.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{topic.profiles?.username?.[0]}</AvatarFallback>
                </Avatar>
                <span>{topic.profiles?.username}</span>
              </div>
              <span>•</span>
              <span>{format(new Date(topic.created_at), 'PPp')}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {topic.content}
            </div>
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-4">
        {topic.forum_replies?.map((reply) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar>
                    <AvatarImage src={reply.profiles?.avatar_url || undefined} />
                    <AvatarFallback>{reply.profiles?.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{reply.profiles?.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(reply.created_at), 'PPp')}
                    </div>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  {reply.content}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}