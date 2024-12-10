import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          setUser(null);
          setSessionToken(null);
          return;
        }
        
        if (session?.user) {
          setUser(session.user);
          setSessionToken(session.access_token);
          if (location.pathname === '/login') {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
        setSessionToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSessionToken(null);
        if (location.pathname !== '/login') {
          navigate('/login');
          toast({
            title: "Session ended",
            description: "Please sign in again to continue.",
          });
        }
      } else if (session?.user) {
        setUser(session.user);
        setSessionToken(session.access_token);
        if (location.pathname === '/login') {
          navigate('/dashboard');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, toast]);

  return { user, sessionToken, isLoading };
}