import { CommunityHeader } from "@/components/community/CommunityHeader";
import { RecipeGrid } from "@/components/community/RecipeGrid";
import { Forums } from "@/components/community/Forums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CommunityHeader />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <Tabs defaultValue="recipes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto bg-background/50 backdrop-blur">
              <TabsTrigger 
                value="recipes"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Recipes
              </TabsTrigger>
              <TabsTrigger 
                value="forums"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Forums
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recipes" className="mt-6">
              <RecipeGrid />
            </TabsContent>
            
            <TabsContent value="forums" className="mt-6">
              <Forums />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}