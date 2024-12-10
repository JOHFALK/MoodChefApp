import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserListProps {
  users: any[];
  isLoading: boolean;
  onPromoteToPremium: (userId: string) => void;
  updatePremiumStatus: { isPending: boolean };
}

export function UserList({
  users,
  isLoading,
  onPromoteToPremium,
  updatePremiumStatus,
}: UserListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!users?.length) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No users found
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
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
            onClick={() => onPromoteToPremium(user.id)}
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
      ))}
    </div>
  );
}