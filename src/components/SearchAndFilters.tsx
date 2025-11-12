import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (value: string) => void;
  selectedDuration: string;
  onDurationChange: (value: string) => void;
  onClearFilters: () => void;
}

export const SearchAndFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedDuration,
  onDurationChange,
  onClearFilters,
}: SearchAndFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedDifficulty !== "all",
    selectedDuration !== "all",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar trilhas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 bg-card border-border"
          />
        </div>

        {/* Filters Button - Mobile */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg" className="md:hidden relative">
              <SlidersHorizontal className="w-4 h-4" />
              {hasActiveFilters && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Refine sua busca por categoria, dificuldade e duração
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <MobileFilters
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={onDifficultyChange}
                selectedDuration={selectedDuration}
                onDurationChange={onDurationChange}
                onClearFilters={() => {
                  onClearFilters();
                  setIsOpen(false);
                }}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Filters - Desktop */}
      <div className="hidden md:flex gap-3 items-center">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="ecossistema">Ecossistema</SelectItem>
            <SelectItem value="financeiro">Financeiro</SelectItem>
            <SelectItem value="geral">Geral</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Dificuldades</SelectItem>
            <SelectItem value="iniciante">Iniciante</SelectItem>
            <SelectItem value="intermediario">Intermediário</SelectItem>
            <SelectItem value="avancado">Avançado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDuration} onValueChange={onDurationChange}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Duração" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Durações</SelectItem>
            <SelectItem value="short">Curta (até 2h)</SelectItem>
            <SelectItem value="medium">Média (2h - 5h)</SelectItem>
            <SelectItem value="long">Longa (5h+)</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Active Filters Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-2">
              {getCategoryLabel(selectedCategory)}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onCategoryChange("all")}
              />
            </Badge>
          )}
          {selectedDifficulty !== "all" && (
            <Badge variant="secondary" className="gap-2">
              {getDifficultyLabel(selectedDifficulty)}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onDifficultyChange("all")}
              />
            </Badge>
          )}
          {selectedDuration !== "all" && (
            <Badge variant="secondary" className="gap-2">
              {getDurationLabel(selectedDuration)}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onDurationChange("all")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

// Mobile Filters Component
const MobileFilters = ({
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedDuration,
  onDurationChange,
  onClearFilters,
  hasActiveFilters,
}: {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (value: string) => void;
  selectedDuration: string;
  onDurationChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Categoria</label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full bg-card border-border">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="ecossistema">Ecossistema</SelectItem>
            <SelectItem value="financeiro">Financeiro</SelectItem>
            <SelectItem value="geral">Geral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Dificuldade</label>
        <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-full bg-card border-border">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Dificuldades</SelectItem>
            <SelectItem value="iniciante">Iniciante</SelectItem>
            <SelectItem value="intermediario">Intermediário</SelectItem>
            <SelectItem value="avancado">Avançado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Duração</label>
        <Select value={selectedDuration} onValueChange={onDurationChange}>
          <SelectTrigger className="w-full bg-card border-border">
            <SelectValue placeholder="Duração" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Durações</SelectItem>
            <SelectItem value="short">Curta (até 2h)</SelectItem>
            <SelectItem value="medium">Média (2h - 5h)</SelectItem>
            <SelectItem value="long">Longa (5h+)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={onClearFilters}
        >
          <X className="w-4 h-4 mr-2" />
          Limpar Todos os Filtros
        </Button>
      )}
    </>
  );
};

// Helper functions
const getCategoryLabel = (value: string) => {
  const labels: Record<string, string> = {
    ecossistema: "Ecossistema",
    financeiro: "Financeiro",
    geral: "Geral",
  };
  return labels[value] || value;
};

const getDifficultyLabel = (value: string) => {
  const labels: Record<string, string> = {
    iniciante: "Iniciante",
    intermediario: "Intermediário",
    avancado: "Avançado",
  };
  return labels[value] || value;
};

const getDurationLabel = (value: string) => {
  const labels: Record<string, string> = {
    short: "Curta (até 2h)",
    medium: "Média (2h - 5h)",
    long: "Longa (5h+)",
  };
  return labels[value] || value;
};
