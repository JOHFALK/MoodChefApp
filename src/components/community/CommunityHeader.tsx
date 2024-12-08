import { motion } from "framer-motion";
import { ChefHat, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function CommunityHeader() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex justify-center">
          <ChefHat className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Recipe Community</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover amazing recipes from our community of chefs. Vote for your favorites and share your own creations.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant="outline"
          className="group"
          onClick={() => navigate("/submit")}
        >
          <ChefHat className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
          Share Recipe
        </Button>
        <Button variant="outline" className="group">
          <TrendingUp className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
          Trending
        </Button>
        <Button variant="outline" className="group">
          <Award className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
          Top Rated
        </Button>
      </div>
    </div>
  );
}