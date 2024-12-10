import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { format } from "date-fns";

interface MoodData {
  created_at: string;
  mood: string;
  intensity: number;
}

interface MoodTrendsChartProps {
  data: MoodData[];
}

export function MoodTrendsChart({ data }: MoodTrendsChartProps) {
  const chartData = data.map(item => ({
    date: format(new Date(item.created_at), 'MMM d'),
    intensity: item.intensity,
    mood: item.mood
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            stroke="currentColor"
            className="text-muted-foreground text-xs"
          />
          <YAxis 
            stroke="currentColor"
            className="text-muted-foreground text-xs"
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">{label}</span>
                      <span className="font-medium">{payload[0].payload.mood}</span>
                      <span className="text-muted-foreground">Intensity:</span>
                      <span className="font-medium">{payload[0].value}</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="intensity"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ fill: "var(--primary)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}