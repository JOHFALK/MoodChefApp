import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { RecipeImporter } from "@/components/dashboard/RecipeImporter";
import { useSubscription } from "@/hooks/use-subscription";

export default function Dashboard() {
  const { data: subscription } = useSubscription();

  return (
    <DashboardLayout>
      <DashboardContent />
      {subscription?.isSubscribed && (
        <div className="mt-8">
          <RecipeImporter />
        </div>
      )}
    </DashboardLayout>
  );
}