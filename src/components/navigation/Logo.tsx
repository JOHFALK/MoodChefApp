import { useNavigate } from "react-router-dom";
import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";

export function Logo() {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 cursor-pointer group"
      onClick={() => navigate("/")}
    >
      <div className="relative">
        <ChefHat className="w-7 h-7 text-primary animate-float" />
        <motion.div
          className="absolute -inset-1 bg-primary/20 rounded-full -z-10"
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
      <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">
        MoodChef
      </span>
    </motion.div>
  );
}