import { motion } from "framer-motion";
import { Trophy, Users, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface FeaturesProps {
  onSubmitRecipe: () => void;
}

export function Features({ onSubmitRecipe }: FeaturesProps) {
  const navigate = useNavigate();

  const features = [
    {
      icon: Trophy,
      title: "Recipe Battles",
      description: "Compete with other chefs in themed cooking challenges",
      action: () => navigate("/battles"),
      buttonText: "Join a Battle"
    },
    {
      icon: Users,
      title: "Community",
      description: "Share stories and connect with fellow food enthusiasts",
      action: () => navigate("/community"),
      buttonText: "Join Community"
    },
    {
      icon: ChefHat,
      title: "Share Recipes",
      description: "Contribute your own mood-enhancing recipes",
      action: onSubmitRecipe,
      buttonText: "Submit Recipe"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="pt-20 border-t"
    >
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
        Discover More Features
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={feature.title}
            className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border border-primary/10"
          >
            <CardHeader>
              <feature.icon className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-foreground">{feature.title}</CardTitle>
              <CardDescription className="text-foreground/70">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white transition-all duration-300
                         border-primary/20 group-hover:border-primary/40"
                onClick={feature.action}
              >
                {feature.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.section>
  );
}