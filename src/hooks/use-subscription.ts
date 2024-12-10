import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useSubscription() {
  const navigate = useNavigate();

  // Effect to check session and redirect if needed
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No active session, redirecting to login');
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);

  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          navigate("/login");
          return { isSubscribed: false };
        }

        if (!session) {
          console.log('No active session found');
          navigate("/login");
          return { isSubscribed: false };
        }

        console.log('Using session for user:', session.user.id);

        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          console.error('Failed to check subscription:', error);
          if (error.message.includes('authenticate') || error.status === 401 || error.status === 403) {
            // Session might be invalid, redirect to login
            navigate("/login");
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