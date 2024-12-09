import { CommunityHeader } from "@/components/community/CommunityHeader";
import { RecipeGrid } from "@/components/community/RecipeGrid";
import { Forums } from "@/components/community/Forums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 max-w-7xl mx-auto space-y-8">
        <CommunityHeader />
        
        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto">
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="forums">Forums</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recipes" className="mt-6">
            <RecipeGrid />
          </TabsContent>
          
          <TabsContent value="forums" className="mt-6">
            <Forums />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}