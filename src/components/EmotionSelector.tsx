import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Smile, Frown, Zap, Coffee, Heart, Battery, Brain, 
  PartyPopper, Target, Flame, Shield, AlertCircle 
} from "lucide-react";
import { useToast } from "./ui/use-toast";

interface EmotionOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const emotions: EmotionOption[] = [
  { name: "Happy", icon: <Smile className="w-6 h-6" />, color: "bg-yellow-100 hover:bg-yellow-200", description: "Joyful and content" },
  { name: "Sad", icon: <Frown className="w-6 h-6" />, color: "bg-blue-100 hover:bg-blue-200", description: "Down or melancholic" },
  { name: "Energetic", icon: <Zap className="w-6 h-6" />, color: "bg-orange-100 hover:bg-orange-200", description: "Full of vigor" },
  { name: "Calm", icon: <Heart className="w-6 h-6" />, color: "bg-green-100 hover:bg-green-200", description: "Peaceful and serene" },
  { name: "Tired", icon: <Battery className="w-6 h-6" />, color: "bg-purple-100 hover:bg-purple-200", description: "Low energy" },
  { name: "Anxious", icon: <Brain className="w-6 h-6" />, color: "bg-red-100 hover:bg-red-200", description: "Worried or uneasy" },
  { name: "Excited", icon: <PartyPopper className="w-6 h-6" />, color: "bg-pink-100 hover:bg-pink-200", description: "Enthusiastic" },
  { name: "Bored", icon: <Coffee className="w-6 h-6" />, color: "bg-gray-100 hover:bg-gray-200", description: "Lacking interest" },
  { name: "Motivated", icon: <Target className="w-6 h-6" />, color: "bg-indigo-100 hover:bg-indigo-200", description: "Driven to achieve" },
  { name: "Angry", icon: <Flame className="w-6 h-6" />, color: "bg-red-200 hover:bg-red-300", description: "Frustrated or upset" },
  { name: "Confident", icon: <Shield className="w-6 h-6" />, color: "bg-emerald-100 hover:bg-emerald-200", description: "Self-assured" },
  { name: "Stressed", icon: <AlertCircle className="w-6 h-6" />, color: "bg-amber-100 hover:bg-amber-200", description: "Under pressure" },
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
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-semibold text-foreground">How are you feeling today?</h2>
        <p className="text-muted-foreground">
          Select up to 2 emotions to find recipes that match your mood
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {emotions.map((emotion) => (
          <Button
            key={emotion.name}
            variant="outline"
            className={cn(
              "h-24 flex flex-col items-center justify-center gap-2 transition-all",
              emotion.color,
              selectedEmotions.includes(emotion.name) && "ring-2 ring-primary",
            )}
            onClick={() => handleEmotionSelect(emotion.name)}
          >
            {emotion.icon}
            <span className="text-sm font-medium">{emotion.name}</span>
          </Button>
        ))}
      </div>
      {selectedEmotions.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Selected emotions: {selectedEmotions.join(" + ")}
        </div>
      )}
    </div>
  );
}