import { RecipeSubmissionForm } from "@/components/RecipeSubmissionForm";
import { Navigation } from "@/components/Navigation";

export default function Submit() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-8">
        <RecipeSubmissionForm />
      </main>
    </div>
  );
}