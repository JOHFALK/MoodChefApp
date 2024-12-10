import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      try {
        // First, get a fresh session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return { isSubscribed: false };
        }

        if (!session) {
          console.log('No active session found');
          return { isSubscribed: false };
        }

        // Refresh the session to ensure we have a valid token
        const { data: { session: refreshedSession }, error: refreshError } = 
          await supabase.auth.refreshSession();

        if (refreshError) {
          console.error('Session refresh error:', refreshError);
          return { isSubscribed: false };
        }

        if (!refreshedSession) {
          console.log('No refreshed session available');
          return { isSubscribed: false };
        }

        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${refreshedSession.access_token}`,
          },
        });

        if (error) {
          console.error('Subscription check error:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Failed to check subscription:', error);
        return { isSubscribed: false };
      }
    },
    retry: false,
  });
}