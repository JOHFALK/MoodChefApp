import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./use-session";

export function useSubscription() {
  const { sessionToken, isLoading: isSessionLoading } = useSession();

  return useQuery({
    queryKey: ['subscription', sessionToken],
    queryFn: async () => {
      if (!sessionToken) {
        return { isSubscribed: false };
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        if (error) {
          console.error('Failed to check subscription:', error);
          return { isSubscribed: false };
        }

        return data;
      } catch (error) {
        console.error('Failed to check subscription:', error);
        return { isSubscribed: false };
      }
    },
    enabled: !isSessionLoading && !!sessionToken,
    retry: false,
  });
}