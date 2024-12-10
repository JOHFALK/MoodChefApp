import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return { isSubscribed: false };
        }

        if (!session) {
          console.log('No active session found');
          return { isSubscribed: false };
        }

        console.log('Session found:', session.user.id); // Debug log

        // Call the edge function with the session token
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
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