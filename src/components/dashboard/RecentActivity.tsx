import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

interface RecentActivityProps {
  recentRecipes: any[];
}

export function RecentActivity({ recentRecipes }: RecentActivityProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest cooking adventures
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentRecipes.length > 0 ? (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {recentRecipes.map((interaction) => (
              <motion.div
                key={interaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-foreground">{interaction.recipes.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Cooked during the {interaction.time_of_day}
                  </p>
                  {interaction.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Note: {interaction.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {interaction.recipes.emotions.map((emotion: string) => (
                    <span
                      key={emotion}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Start cooking to see your activity here!
          </p>
        )}
      </CardContent>
    </Card>
  );
}