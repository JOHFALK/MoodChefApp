import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useSubscription() {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Effect to check session and redirect if needed
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          console.log('No active session or session error, redirecting to login');
          navigate("/login");
          return;
        }
        setSessionToken(session.access_token);
        setIsInitialized(true);
      } catch (error) {
        console.error('Session check error:', error);
        navigate("/login");
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/login");
        setSessionToken(null);
        setIsInitialized(false);
      } else {
        setSessionToken(session.access_token);
        setIsInitialized(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return useQuery({
    queryKey: ['subscription', sessionToken],
    queryFn: async () => {
      if (!sessionToken) {
        throw new Error('No active session');
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        if (error) {
          console.error('Failed to check subscription:', error);
          if (error.message.includes('authenticate') || error.status === 401 || error.status === 403) {
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
    enabled: isInitialized && !!sessionToken,
    retry: false,
  });
}