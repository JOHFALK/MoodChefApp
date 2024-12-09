import { useState } from "react";
import { Crown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UserSearch } from "./UserSearch";
import { UserList } from "./UserList";

export function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"username" | "email">("username");
  const [selectedDuration, setSelectedDuration] = useState("1");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", searchQuery, searchType],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        if (searchType === "username") {
          query = query.ilike("username", `%${searchQuery}%`);
        } else {
          // For email search, we'll use the display_name field which often contains the email
          query = query.ilike("display_name", `%${searchQuery}%`);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
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
          <UserSearch
            searchQuery={searchQuery}
            searchType={searchType}
            onSearchChange={setSearchQuery}
            onSearchTypeChange={setSearchType}
            selectedDuration={selectedDuration}
            onDurationChange={setSelectedDuration}
          />
          <UserList
            users={users}
            isLoading={isLoading}
            onPromoteToPremium={handlePromoteToPremium}
            updatePremiumStatus={updatePremiumStatus}
          />
        </div>
      </CardContent>
    </Card>
  );
}