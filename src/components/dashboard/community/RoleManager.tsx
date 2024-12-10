import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, User, Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function RoleManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("username");

      if (searchQuery) {
        query = query.ilike("username", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({
      userId,
      role,
      value,
    }: {
      userId: string;
      role: "is_moderator" | "is_admin";
      value: boolean;
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ [role]: value })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Role updated",
        description: "User role has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating role",
        description: "There was an error updating the user role",
        variant: "destructive",
      });
      console.error("Error updating role:", error);
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <CardTitle>Community Role Management</CardTitle>
        </div>
        <CardDescription>
          Manage administrator and moderator roles for community members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : !users?.length ? (
              <p className="text-center text-muted-foreground py-4">
                No users found
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border"
                >
                  <div>
                    <h3 className="font-medium">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.is_admin
                        ? "Administrator"
                        : user.is_moderator
                        ? "Moderator"
                        : "Member"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={user.is_moderator ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateRole.mutate({
                          userId: user.id,
                          role: "is_moderator",
                          value: !user.is_moderator,
                        })
                      }
                      className="gap-1"
                    >
                      {user.is_moderator ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Moderator
                    </Button>
                    <Button
                      variant={user.is_admin ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateRole.mutate({
                          userId: user.id,
                          role: "is_admin",
                          value: !user.is_admin,
                        })
                      }
                      className="gap-1"
                    >
                      {user.is_admin ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Admin
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}