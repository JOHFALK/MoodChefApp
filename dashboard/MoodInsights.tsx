import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

interface MoodData {
  mood: string;
  intensity: number;
}

interface MoodInsightsProps {
  data: MoodData[];
}

export function MoodInsights({ data }: MoodInsightsProps) {
  const getMoodInsights = (moodData: MoodData[]) => {
    if (!moodData.length) return null;

    const moodCounts = moodData.reduce((acc, { mood }) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantMood = Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)[0][0];

    const recommendations: Record<string, string[]> = {
      'Angry': ['Calming chamomile tea recipes', 'Soothing lavender desserts'],
      'Anxious': ['Stress-reducing dark chocolate treats', 'Calming green smoothies'],
      'Sad': ['Mood-lifting citrus dishes', 'Comforting warm soups'],
      'Happy': ['Energizing fruit bowls', 'Celebratory festive dishes'],
      'Tired': ['Energy-boosting breakfast ideas', 'Revitalizing protein snacks'],
    };

    return {
      dominantMood,
      recommendations: recommendations[dominantMood] || ['Balanced nutritious meals', 'Mindful cooking recipes'],
    };
  };

  const insights = getMoodInsights(data);

  if (!insights) {
    return (
      <div className="text-center text-muted-foreground">
        Start tracking your moods to get personalized insights
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="font-medium">Recent Mood Pattern</h3>
      </div>
      
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground mb-3">
          You've been feeling <span className="font-medium text-foreground">{insights.dominantMood.toLowerCase()}</span> more often lately.
          Here are some recipes that might help:
        </p>
        <div className="flex flex-wrap gap-2">
          {insights.recommendations.map((recommendation, index) => (
            <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              {recommendation}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}