import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface CookingPattern {
  time_of_day: string;
  count: number;
}

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
            <Bar dataKey="count" fill="var(--color-bar)" />
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}