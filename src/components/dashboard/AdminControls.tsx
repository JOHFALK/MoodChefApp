import { useState } from "react";
import { Shield, CheckCircle2, XCircle, Users, Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

export function AdminControls() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: premiumUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true);

      return {
        totalUsers: totalUsers || 0,
        premiumUsers: premiumUsers || 0,
      };
    },
  });

  const { data: pendingRecipes, refetch } = useQuery({
    queryKey: ['pending-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleApprove = async (recipeId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ status: 'approved' })
        .eq('id', recipeId);

      if (error) throw error;

      toast({
        title: "Recipe approved",
        description: "The recipe is now visible to all users",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not approve recipe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (recipeId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ status: 'rejected' })
        .eq('id', recipeId);

      if (error) throw error;

      toast({
        title: "Recipe rejected",
        description: "The recipe has been rejected",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not reject recipe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-100">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <CardTitle>Admin Controls</CardTitle>
        </div>
        <CardDescription>
          Manage pending recipe submissions and view user statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Total Users</span>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {userStats?.totalUsers || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Premium Users</span>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {userStats?.premiumUsers || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          {pendingRecipes?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No pending recipes to review
            </p>
          ) : (
            pendingRecipes?.map((recipe) => (
              <div
                key={recipe.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-primary-100"
              >
                <div>
                  <h3 className="font-medium">{recipe.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {recipe.description?.slice(0, 100)}...
                  </p>
                  <div className="flex gap-2 mt-2">
                    {recipe.emotions.map((emotion: string) => (
                      <Badge
                        key={emotion}
                        variant="secondary"
                        className="bg-secondary/20"
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(recipe.id)}
                    disabled={isLoading}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(recipe.id)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}