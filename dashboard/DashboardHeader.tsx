import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  userEmail: string | undefined;
  onSignOut: () => Promise<void>;
}

export function DashboardHeader({ userEmail, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="py-6 px-4 border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <ChefHat className="w-8 h-8 text-primary animate-float" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MoodChef Dashboard
          </h1>
        </motion.div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            Welcome, {userEmail}
          </span>
          <Button variant="outline" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}