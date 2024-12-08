import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Smile, Frown, Zap, Coffee, Heart, Battery, Brain, 
  PartyPopper, Target, Flame, Shield, AlertCircle 
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";

interface EmotionOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  bgColor: string;
}

const emotions: EmotionOption[] = [
  { 
    name: "Happy", 
    icon: <Smile className="w-6 h-6" />, 
    color: "text-mood-happy",
    bgColor: "bg-mood-happy/10",
    description: "Joyful and content" 
  },
  { 
    name: "Sad", 
    icon: <Frown className="w-6 h-6" />, 
    color: "text-mood-sad",
    bgColor: "bg-mood-sad/10",
    description: "Down or melancholic" 
  },
  { 
    name: "Energetic", 
    icon: <Zap className="w-6 h-6" />, 
    color: "text-mood-energetic",
    bgColor: "bg-mood-energetic/10",
    description: "Full of vigor" 
  },
  { 
    name: "Calm", 
    icon: <Heart className="w-6 h-6" />, 
    color: "text-mood-calm",
    bgColor: "bg-mood-calm/10",
    description: "Peaceful and serene" 
  },
  { 
    name: "Tired", 
    icon: <Battery className="w-6 h-6" />, 
    color: "text-mood-tired",
    bgColor: "bg-mood-tired/10",
    description: "Low energy" 
  },
  { 
    name: "Anxious", 
    icon: <Brain className="w-6 h-6" />, 
    color: "text-mood-anxious",
    bgColor: "bg-mood-anxious/10",
    description: "Worried or uneasy" 
  },
  { 
    name: "Excited", 
    icon: <PartyPopper className="w-6 h-6" />, 
    color: "text-mood-excited",
    bgColor: "bg-mood-excited/10",
    description: "Enthusiastic" 
  },
  { 
    name: "Bored", 
    icon: <Coffee className="w-6 h-6" />, 
    color: "text-mood-bored",
    bgColor: "bg-mood-bored/10",
    description: "Lacking interest" 
  },
  { 
    name: "Motivated", 
    icon: <Target className="w-6 h-6" />, 
    color: "text-mood-motivated",
    bgColor: "bg-mood-motivated/10",
    description: "Driven to achieve" 
  },
  { 
    name: "Angry", 
    icon: <Flame className="w-6 h-6" />, 
    color: "text-mood-angry",
    bgColor: "bg-mood-angry/10",
    description: "Frustrated or upset" 
  },
  { 
    name: "Confident", 
    icon: <Shield className="w-6 h-6" />, 
    color: "text-mood-confident",
    bgColor: "bg-mood-confident/10",
    description: "Self-assured" 
  },
  { 
    name: "Stressed", 
    icon: <AlertCircle className="w-6 h-6" />, 
    color: "text-mood-stressed",
    bgColor: "bg-mood-stressed/10",
    description: "Under pressure" 
  },
];

interface EmotionSelectorProps {
  selectedEmotions: string[];
  onEmotionSelect: (emotion: string) => void;
}

export function EmotionSelector({ selectedEmotions, onEmotionSelect }: EmotionSelectorProps) {
  const { toast } = useToast();

  const handleEmotionSelect = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      onEmotionSelect(emotion); // Will remove it
    } else if (selectedEmotions.length < 2) {
      onEmotionSelect(emotion); // Will add it
    } else {
      toast({
        title: "Maximum emotions selected",
        description: "You can select up to 2 emotions to find the perfect recipe",
        variant: "default",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div 
        className="text-center space-y-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          How are you feeling today?
        </h2>
        <p className="text-muted-foreground">
          Select up to 2 emotions to find recipes that match your mood
        </p>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {emotions.map((emotion, index) => (
          <motion.div
            key={emotion.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant="outline"
              className={cn(
                "h-24 w-full flex flex-col items-center justify-center gap-2 transition-all duration-300",
                emotion.bgColor,
                emotion.color,
                selectedEmotions.includes(emotion.name) && 
                "ring-2 ring-primary shadow-lg scale-105",
                "hover:scale-105 hover:shadow-md group"
              )}
              onClick={() => handleEmotionSelect(emotion.name)}
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="transition-colors group-hover:text-primary"
              >
                {emotion.icon}
              </motion.div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                {emotion.name}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedEmotions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 text-center"
          >
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Selected: {selectedEmotions.join(" + ")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}