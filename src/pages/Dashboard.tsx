import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { RecipeImporter } from "@/components/dashboard/RecipeImporter";
import { useSubscription } from "@/hooks/use-subscription";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: subscription, isLoading: isSubscriptionLoading } = useSubscription();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading || isSubscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
        <DashboardContent />
        {isAdmin && subscription?.isSubscribed && (
          <div className="container py-8">
            <RecipeImporter />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}