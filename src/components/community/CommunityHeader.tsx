import { motion } from "framer-motion";
import { ChefHat, TrendingUp, Award, Search, PlusCircle, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function CommunityHeader() {
  const navigate = useNavigate();

  const stats = [
    { label: "Active Members", value: "2.4k", icon: Users },
    { label: "Recipes Shared", value: "15k", icon: ChefHat },
    { label: "Daily Interactions", value: "5.2k", icon: Heart },
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
            <div className="text-sm text-muted-foreground">{stat.label}</div>
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
        <Button variant="outline" className="group border-primary/20">
          <TrendingUp className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
          Trending
        </Button>
        <Button variant="outline" className="group border-primary/20">
          <Award className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
          Top Rated
        </Button>
      </motion.div>
    </div>
  );
}