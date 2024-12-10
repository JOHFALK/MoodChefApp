import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function useSubscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          setSessionToken(null);
          if (location.pathname !== '/login') {
            navigate("/login");
          }
          return;
        }
        
        if (session) {
          setSessionToken(session.access_token);
          setIsInitialized(true);
          if (location.pathname === '/login') {
            navigate("/dashboard");
          }
        } else if (location.pathname !== '/login') {
          navigate("/login");
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (location.pathname !== '/login') {
          navigate("/login");
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setSessionToken(null);
        setIsInitialized(false);
        if (location.pathname !== '/login') {
          navigate("/login");
        }
      } else if (session) {
        setSessionToken(session.access_token);
        setIsInitialized(true);
        if (location.pathname === '/login') {
          navigate("/dashboard");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

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
            if (location.pathname !== '/login') {
              navigate("/login");
            }
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