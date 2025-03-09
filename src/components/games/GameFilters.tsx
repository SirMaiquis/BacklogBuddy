import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GAME_PLATFORMS, GAME_GENRES } from "@/types/game";
import { Search, SlidersHorizontal, X, Gamepad, Joystick } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameFiltersProps {
  onFilterChange: (filters: GameFilters) => void;
}

export interface GameFilters {
  search: string;
  platform: string;
  genre: string;
}

export function GameFilters({ onFilterChange }: GameFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<GameFilters>({
    search: "",
    platform: "",
    genre: "",
  });

  const handleFilterChange = (key: keyof GameFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { search: "", platform: "", genre: "" };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFiltersCount = [
    filters.search ? 1 : 0,
    filters.platform ? 1 : 0,
    filters.genre ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <Card className="shadow-md border-primary/10 overflow-hidden">
      <div className="flex flex-col space-y-4 p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games by title..."
              className="pl-8 border-primary/10 focus-visible:ring-primary/20"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
          <Button
            variant={isExpanded ? "secondary" : "outline"}
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFiltersCount > 0 && !isExpanded && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary"
                variant="default"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          {(filters.search || filters.platform || filters.genre) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Gamepad className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium">Platform</label>
              </div>
              <Select
                value={filters.platform}
                onValueChange={(value) => handleFilterChange("platform", value)}
              >
                <SelectTrigger className="border-primary/10">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Platforms</SelectItem>
                  {GAME_PLATFORMS.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Joystick className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium">Genre</label>
              </div>
              <Select
                value={filters.genre}
                onValueChange={(value) => handleFilterChange("genre", value)}
              >
                <SelectTrigger className="border-primary/10">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genres</SelectItem>
                  {GAME_GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filters.search && (
              <Badge variant="secondary" className="gap-1 px-2 py-1">
                Search: {filters.search}
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.platform && (
              <Badge variant="secondary" className="gap-1 px-2 py-1">
                Platform: {filters.platform}
                <button
                  onClick={() => handleFilterChange("platform", "")}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.genre && (
              <Badge variant="secondary" className="gap-1 px-2 py-1">
                Genre: {filters.genre}
                <button
                  onClick={() => handleFilterChange("genre", "")}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
