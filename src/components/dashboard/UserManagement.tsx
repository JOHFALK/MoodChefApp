import { useState } from "react";
import { Search, Crown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("1");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(
          `username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  const updatePremiumStatus = useMutation({
    mutationFn: async ({
      userId,
      months,
    }: {
      userId: string;
      months: number;
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_premium: true,
          premium_until: new Date(
            Date.now() + months * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User premium status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user premium status",
        variant: "destructive",
      });
      console.error("Error updating premium status:", error);
    },
  });

  const handlePromoteToPremium = (userId: string) => {
    updatePremiumStatus.mutate({
      userId,
      months: parseInt(selectedDuration),
    });
  };

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-100">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          <CardTitle>User Management</CardTitle>
        </div>
        <CardDescription>
          Manage user premium status and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={selectedDuration}
              onValueChange={setSelectedDuration}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 6, 12].map((months) => (
                  <SelectItem key={months} value={months.toString()}>
                    {months} {months === 1 ? "Month" : "Months"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : users?.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No users found
              </p>
            ) : (
              users?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-primary-100"
                >
                  <div>
                    <h3 className="font-medium">
                      {user.display_name || user.username || "Unnamed User"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.is_premium ? "Premium Member" : "Regular Member"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePromoteToPremium(user.id)}
                    disabled={updatePremiumStatus.isPending}
                    className={`${
                      user.is_premium
                        ? "text-primary hover:text-primary-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    {user.is_premium ? "Extend Premium" : "Make Premium"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}