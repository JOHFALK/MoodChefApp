import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ForumSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ForumSearch({ searchQuery, setSearchQuery }: ForumSearchProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full md:w-96"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search categories or topics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 bg-background/50 backdrop-blur border-primary/20 focus:border-primary transition-colors"
      />
    </motion.div>
  );
}