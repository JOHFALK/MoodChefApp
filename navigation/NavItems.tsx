import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavItems() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { label: "Explore", path: "/" },
    { 
      label: "Battles", 
      path: "/battles",
      icon: Trophy,
      description: "Join cooking challenges"
    },
    { 
      label: "Community", 
      path: "/community",
      icon: Users,
      description: "Share stories & photos"
    },
    { label: "Pricing", path: "/pricing" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          className={cn(
            "nav-item text-sm font-medium",
            location.pathname === item.path && "bg-primary/10 text-primary"
          )}
          onClick={() => navigate(item.path)}
        >
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
        </Button>
      ))}
    </nav>
  );
}