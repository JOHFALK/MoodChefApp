import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface MindfulPromptProps {
  emotions: string[];
}

const emotionPrompts: Record<string, string[]> = {
  Happy: [
    "Channel your joy into each stir and fold.",
    "Notice how your positive energy flows into the preparation.",
    "Share your happiness by adding an extra touch of care.",
  ],
  Sad: [
    "Let the warmth of the kitchen embrace you.",
    "Focus on the nourishing aspects of each ingredient.",
    "Take comfort in the therapeutic rhythm of cooking.",
  ],
  Energetic: [
    "Let's enjoy the rhythm of chopping – a dance of preparation.",
    "Channel your energy into creating something amazing.",
    "Feel the vibrant life in each fresh ingredient.",
  ],
  Calm: [
    "Take a moment to notice the texture and color of your ingredients.",
    "Breathe in the aromatic essence of your creation.",
    "Move mindfully through each step of the process.",
  ],
  Tired: [
    "Take it slow and steady – there's no rush.",
    "Let the process energize you naturally.",
    "Focus on one simple step at a time.",
  ],
  Anxious: [
    "Breathe deeply while stirring – let your worries melt away with each turn.",
    "Ground yourself in the present moment of creation.",
    "Feel the stability of the counter beneath your hands.",
  ],
  Excited: [
    "Channel your enthusiasm into creative presentation.",
    "Celebrate each step of the cooking process.",
    "Let your excitement inspire culinary innovation.",
  ],
  Bored: [
    "Explore new textures and combinations.",
    "Challenge yourself to plate with extra creativity.",
    "Experiment with different preparation techniques.",
  ],
  Motivated: [
    "Set your intention for this cooking session.",
    "Appreciate how each action brings you closer to your goal.",
    "Take pride in your attention to detail.",
  ],
  Angry: [
    "Transform that energy into powerful, purposeful movements.",
    "Find release in the rhythm of chopping and mixing.",
    "Let the process of creation cool your flames.",
  ],
  Confident: [
    "Trust your instincts with seasoning and timing.",
    "Move with purpose and precision.",
    "Take pride in your culinary skills.",
  ],
  Stressed: [
    "Focus on the simple pleasure of creating.",
    "Let the routine of cooking ground you.",
    "Take a moment to appreciate your progress.",
  ],
};

export function MindfulPrompt({ emotions }: MindfulPromptProps) {
  const getRandomPrompt = (emotion: string) => {
    const prompts = emotionPrompts[emotion] || [];
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const prompt = emotions.length > 0 
    ? getRandomPrompt(emotions[0])
    : "Take a moment to center yourself before beginning.";

  return (
    <Card className="bg-primary/5 border-none">
      <CardContent className="flex items-center gap-4 p-6">
        <Lightbulb className="w-6 h-6 text-primary" />
        <p className="text-lg text-foreground italic">{prompt}</p>
      </CardContent>
    </Card>
  );
}