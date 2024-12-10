import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return { isSubscribed: false };
        }

        if (!session) {
          console.log('No active session found');
          return { isSubscribed: false };
        }

        console.log('Using session for user:', session.user.id);

        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          console.error('Subscription check error:', error);
          // If authentication failed, return false instead of throwing
          if (error.message.includes('authenticate') || error.status === 401) {
            return { isSubscribed: false };
          }
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Failed to check subscription:', error);
        return { isSubscribed: false };
      }
    },
    retry: false,
    // Refresh subscription status every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}