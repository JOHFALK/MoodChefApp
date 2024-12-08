import { useEffect, useState } from "react";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface CookingPattern {
  time_of_day: string;
  count: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium">{label}:</span>
          <span className="font-medium">{payload[0].value} recipes</span>
        </div>
      </div>
    );
  }
  return null;
};

export function CookingPatternChart() {
  const [data, setData] = useState<CookingPattern[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: interactions } = await supabase
        .from("recipe_interactions")
        .select("time_of_day")
        .eq("user_id", user.id);

      if (!interactions) return;

      const patterns = interactions.reduce((acc: Record<string, number>, curr) => {
        acc[curr.time_of_day] = (acc[curr.time_of_day] || 0) + 1;
        return acc;
      }, {});

      setData(
        Object.entries(patterns).map(([time_of_day, count]) => ({
          time_of_day,
          count,
        }))
      );
    };

    fetchData();
  }, []);

  return (
    <div className="h-[300px] w-full">
      <ChartContainer
        config={{
          bar: { theme: { light: "#0ea5e9", dark: "#38bdf8" } },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="time_of_day" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="var(--color-bar)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}