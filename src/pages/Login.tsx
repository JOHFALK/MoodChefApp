import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-6 px-4 border-b">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">MoodChef</h1>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Welcome to MoodChef</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to track your cooking journey and get personalized recommendations
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}