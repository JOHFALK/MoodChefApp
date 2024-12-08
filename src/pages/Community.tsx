import { Navigation } from "@/components/Navigation";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { RecipeGrid } from "@/components/community/RecipeGrid";

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4 max-w-7xl mx-auto space-y-8">
        <CommunityHeader />
        <RecipeGrid />
      </main>
    </div>
  );
}