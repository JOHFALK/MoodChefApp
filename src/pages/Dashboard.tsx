import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { RecipeImporter } from "@/components/dashboard/RecipeImporter";
import { useSubscription } from "@/hooks/use-subscription";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { data: subscription } = useSubscription();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <DashboardContent />
      {isAdmin && subscription?.isSubscribed && (
        <div className="container py-8">
          <RecipeImporter />
        </div>
      )}
    </div>
  );
}