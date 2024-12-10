import { motion } from "framer-motion";
import { ChefHat, TrendingUp, Award, Search, PlusCircle, Users, Heart, Sparkles, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CommunityHeader() {
  const navigate = useNavigate();

  const stats = [
    { 
      label: "Success Stories", 
      value: "500+", 
      icon: Trophy,
      description: "Mood-boosting recipes shared"
    },
    { 
      label: "Recipe Categories", 
      value: "25+", 
      icon: Star,
      description: "Unique emotional cuisines"
    },
    { 
      label: "Happy Cooks", 
      value: "98%", 
      icon: Sparkles,
      description: "Reported mood improvement"
    },
  ];

  return (
    <div className="space-y-8 text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <div className="relative">
            <ChefHat className="w-16 h-16 text-primary animate-float" />
            <motion.div
              className="absolute -inset-2 bg-primary/20 rounded-full -z-10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Recipe Community
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join our vibrant community of food enthusiasts. Share recipes, discuss cooking techniques, 
            and discover how food affects your mood.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="glass-card p-6 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
            <div className="text-xs text-muted-foreground">{stat.description}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Button
          variant="default"
          className="group bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
          onClick={() => navigate("/submit")}
        >
          <PlusCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Share Recipe
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="group border-primary/20">
              <TrendingUp className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
              Create Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unlock Full Community Access</DialogTitle>
              <DialogDescription className="space-y-4 pt-4">
                <p>
                  As a free member, you can browse and participate in existing discussions. 
                  Upgrade to Premium to unlock these exclusive features:
                </p>
                <ul className="list-none space-y-3">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Create new topics in any category
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Access premium recipe categories
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Join exclusive cooking challenges
                  </li>
                </ul>
                <Button 
                  className="w-full mt-4"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade to Premium
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Button variant="outline" className="group border-primary/20">
          <Award className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
          Top Rated
        </Button>
      </motion.div>
    </div>
  );
}