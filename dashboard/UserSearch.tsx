import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserSearchProps {
  searchQuery: string;
  searchType: "username" | "email";
  onSearchChange: (value: string) => void;
  onSearchTypeChange: (value: "username" | "email") => void;
  selectedDuration: string;
  onDurationChange: (value: string) => void;
}

export function UserSearch({
  searchQuery,
  searchType,
  onSearchChange,
  onSearchTypeChange,
  selectedDuration,
  onDurationChange,
}: UserSearchProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search users by ${searchType}...`}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={searchType} onValueChange={onSearchTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Search by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="username">Username</SelectItem>
          <SelectItem value="email">Email</SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedDuration} onValueChange={onDurationChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Duration" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 6, 12].map((months) => (
            <SelectItem key={months} value={months.toString()}>
              {months} {months === 1 ? "Month" : "Months"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}