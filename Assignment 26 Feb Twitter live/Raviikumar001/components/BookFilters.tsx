import type { Book } from "@/types/book"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { Label } from "./ui/label"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { LayoutGrid, List } from "lucide-react"

interface BookFiltersProps {
  genres: string[]
  onFilterChange: (filters: { genre: string; minRating: number }) => void
  onSortChange: (sortBy: keyof Book) => void
  viewMode: "table" | "card"
  onViewModeChange: (mode: "table" | "card") => void
}

export default function BookFilters({
  genres,
  onFilterChange,
  onSortChange,
  viewMode,
  onViewModeChange,
}: BookFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="grid sm:grid-cols-3 gap-4 flex-grow">
        <div className="space-y-2">
          <Label htmlFor="genre-select">Genre</Label>
          <Select onValueChange={(value) => onFilterChange({ genre: value, minRating: 0 })}>
            <SelectTrigger id="genre-select">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating-slider">Minimum Rating</Label>
          <Slider
            id="rating-slider"
            min={0}
            max={5}
            step={0.1}
            defaultValue={[0]}
            onValueChange={([value]) => onFilterChange({ genre: "", minRating: value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort-select">Sort By</Label>
          <Select onValueChange={(value) => onSortChange(value as keyof Book)}>
            <SelectTrigger id="sort-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="publicationYear">Publication Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ToggleGroup type="single" value={viewMode} onValueChange={(value: "table" | "card") => onViewModeChange(value)}>
        <ToggleGroupItem value="table" aria-label="Table view">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="card" aria-label="Card view">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

