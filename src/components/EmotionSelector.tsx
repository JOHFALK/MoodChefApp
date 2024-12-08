import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Smile, Frown, Zap, Coffee, Heart, Battery, Brain, PartyPopper, Mug, Target } from "lucide-react";

interface EmotionOption {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const emotions: EmotionOption[] = [
  { name: "Happy", icon: <Smile className="w-6 h-6" />, color: "bg-yellow-100 hover:bg-yellow-200" },
  { name: "Sad", icon: <Frown className="w-6 h-6" />, color: "bg-blue-100 hover:bg-blue-200" },
  { name: "Energetic", icon: <Zap className="w-6 h-6" />, color: "bg-orange-100 hover:bg-orange-200" },
  { name: "Calm", icon: <Heart className="w-6 h-6" />, color: "bg-green-100 hover:bg-green-200" },
  { name: "Tired", icon: <Battery className="w-6 h-6" />, color: "bg-purple-100 hover:bg-purple-200" },
  { name: "Anxious", icon: <Brain className="w-6 h-6" />, color: "bg-red-100 hover:bg-red-200" },
  { name: "Excited", icon: <PartyPopper className="w-6 h-6" />, color: "bg-pink-100 hover:bg-pink-200" },
  { name: "Bored", icon: <Mug className="w-6 h-6" />, color: "bg-gray-100 hover:bg-gray-200" },
  { name: "Motivated", icon: <Target className="w-6 h-6" />, color: "bg-indigo-100 hover:bg-indigo-200" },
];

interface EmotionSelectorProps {
  selectedEmotions: string[];
  onEmotionSelect: (emotion: string) => void;
}

export function EmotionSelector({ selectedEmotions, onEmotionSelect }: EmotionSelectorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">How are you feeling today?</h2>
      <div className="grid grid-cols-3 gap-4 p-4">
        {emotions.map((emotion) => (
          <Button
            key={emotion.name}
            variant="outline"
            className={cn(
              "h-24 flex flex-col items-center justify-center gap-2 transition-all",
              emotion.color,
              selectedEmotions.includes(emotion.name) && "ring-2 ring-primary",
            )}
            onClick={() => onEmotionSelect(emotion.name)}
          >
            {emotion.icon}
            <span className="text-sm font-medium">{emotion.name}</span>
          </Button>
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 mt-4">
        Select up to 2 emotions to find the perfect recipe for your mood
      </p>
    </div>
  );
}