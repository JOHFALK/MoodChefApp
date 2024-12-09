import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ForumSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ForumSearch({ searchQuery, setSearchQuery }: ForumSearchProps) {
  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search categories or topics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}