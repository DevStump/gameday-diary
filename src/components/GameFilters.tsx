
import React, { useState } from 'react';
import { Search, Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { formatTeamName } from '@/utils/teamLogos';

interface GameFiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    league: string;
    season: string;
    playoff: string;
    search: string;
    mode?: string; // Optional mode filter for diary pages
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  showModeFilter?: boolean; // Whether to show the mode filter
}

const GameFilters = ({ filters, onFilterChange, onClearFilters, showModeFilter = false }: GameFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  // Show years from 2000 to 2025 for MLB data coverage
  const seasons = Array.from({ length: 26 }, (_, i) => 2025 - i);

  // Team abbreviations for both leagues (sorted alphabetically)
  const nflTeams = [
    'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE',
    'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC',
    'LV', 'LAC', 'LAR', 'MIA', 'MIN', 'NE', 'NO', 'NYG',
    'NYJ', 'PHI', 'PIT', 'SF', 'SEA', 'TB', 'TEN', 'WAS'
  ].sort();

  const mlbTeams = [
    'ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CWS', 'CIN', 'CLE',
    'COL', 'DET', 'HOU', 'KC', 'LAA', 'LAD', 'MIA', 'MIL',
    'MIN', 'NYM', 'NYY', 'OAK', 'PHI', 'PIT', 'SD', 'SF',
    'SEA', 'STL', 'TB', 'TEX', 'TOR', 'WSH'
  ].sort();

  // Convert filters to selected date for the calendar
  const getSelectedDate = (): Date | undefined => {
    if (!filters.startDate) return undefined;
    
    try {
      const [year, month, day] = filters.startDate.split('-').map(Number);
      return new Date(year, month - 1, day);
    } catch {
      return undefined;
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    console.log('Date changed:', date);
    
    if (date) {
      // Format as YYYY-MM-DD
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const selectedDate = formatDate(date);
      
      console.log('Setting date:', selectedDate);
      // Set both start and end date to the same value for compatibility
      onFilterChange('startDate', selectedDate);
      onFilterChange('endDate', selectedDate);
    } else {
      // Clear both dates if no date is selected
      console.log('Clearing date');
      onFilterChange('startDate', '');
      onFilterChange('endDate', '');
    }
  };

  // Helper function to get the display text for selected team
  const getSelectedTeamDisplay = (selectedTeam: string): string => {
    if (!selectedTeam || selectedTeam === 'all') {
      return 'All Teams';
    }

    // Handle new format: "ATL:NFL" or "ATL:MLB"
    if (selectedTeam.includes(':')) {
      const [teamAbbr, league] = selectedTeam.split(':');
      const teamName = formatTeamName(teamAbbr, league as 'NFL' | 'MLB');
      return `${teamAbbr} - ${teamName}`;
    }

    // Legacy format handling (fallback)
    const nflName = formatTeamName(selectedTeam, 'NFL');
    const mlbName = formatTeamName(selectedTeam, 'MLB');
    
    if (nflName !== 'Unknown Team') {
      return `${selectedTeam} - ${nflName}`;
    } else if (mlbName !== 'Unknown Team') {
      return `${selectedTeam} - ${mlbName}`;
    }

    return selectedTeam;
  };

  // Helper function to get display text for active filter badge
  const getTeamBadgeText = (selectedTeam: string): string => {
    if (selectedTeam.includes(':')) {
      const [teamAbbr, league] = selectedTeam.split(':');
      const teamName = formatTeamName(teamAbbr, league as 'NFL' | 'MLB');
      return `${teamAbbr} - ${teamName}`;
    }
    return selectedTeam;
  };

  const handleApplyFilters = () => {
    setIsOpen(false);
  };

  const handleClearAndClose = () => {
    onClearFilters();
    setIsOpen(false);
  };

  const selectedDate = getSelectedDate();

  // Filter content component to avoid duplication
  const FilterContent = () => (
    <>
      <div className={`grid gap-4 mb-4 ${showModeFilter ? 'grid-cols-6' : 'grid-cols-5'}`}>
        {/* League */}
        <Select value={filters.league} onValueChange={(value) => onFilterChange('league', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Leagues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leagues</SelectItem>
            <SelectItem value="NFL">NFL</SelectItem>
            <SelectItem value="MLB">MLB</SelectItem>
          </SelectContent>
        </Select>

        {/* Teams Dropdown - Sectioned by Sport */}
        <Select value={filters.search} onValueChange={(value) => onFilterChange('search', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <span className="text-sm">
              {getSelectedTeamDisplay(filters.search)}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {(!filters.league || filters.league === 'NFL') && (
              <>
                <SelectGroup>
                  <SelectLabel>NFL Teams</SelectLabel>
                  {nflTeams.map((team) => (
                    <SelectItem key={`nfl-${team}`} value={`${team}:NFL`}>
                      {team} - {formatTeamName(team, 'NFL')}
                    </SelectItem>
                  ))}
                </SelectGroup>
                {(!filters.league || filters.league === 'MLB') && <Separator className="my-2" />}
              </>
            )}
            {(!filters.league || filters.league === 'MLB') && (
              <SelectGroup>
                <SelectLabel>MLB Teams</SelectLabel>
                {mlbTeams.map((team) => (
                  <SelectItem key={`mlb-${team}`} value={`${team}:MLB`}>
                    {team} - {formatTeamName(team, 'MLB')}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>

        {/* Season */}
        <Select value={filters.season} onValueChange={(value) => onFilterChange('season', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Seasons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seasons</SelectItem>
            {seasons.map((season) => (
              <SelectItem key={season} value={season.toString()}>
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Playoff */}
        <Select value={filters.playoff} onValueChange={(value) => onFilterChange('playoff', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Games" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            <SelectItem value="true">Playoff Games</SelectItem>
            <SelectItem value="false">Regular Season</SelectItem>
            <SelectItem value="exhibition">Exhibition</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "MMM dd, yyyy")
              ) : (
                "Select date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Mode Filter - Only show on diary pages */}
        {showModeFilter && (
          <Select value={filters.mode || ''} onValueChange={(value) => onFilterChange('mode', value === 'all' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="watched">Watched</SelectItem>
              <SelectItem value="attended">Attended</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Team: {getTeamBadgeText(filters.search)}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => onFilterChange('search', '')}
              />
            </Badge>
          )}
          {filters.league && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>League: {filters.league}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => onFilterChange('league', '')}
              />
            </Badge>
          )}
          {filters.season && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Season: {filters.season}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => onFilterChange('season', '')}
              />
            </Badge>
          )}
          {filters.playoff && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>
                {filters.playoff === 'true' ? 'Playoff Games' : 
                 filters.playoff === 'false' ? 'Regular Season' : 
                 'Exhibition'}
              </span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => onFilterChange('playoff', '')}
              />
            </Badge>
          )}
          {filters.mode && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Mode: {filters.mode === 'watched' ? 'Watched' : 'Attended'}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => onFilterChange('mode', '')}
              />
            </Badge>
          )}
          {selectedDate && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>
                Date: {format(selectedDate, "MMM dd, yyyy")}
              </span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => {
                  onFilterChange('startDate', '');
                  onFilterChange('endDate', '');
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:block bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Games</h3>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Version */}
      <div className="md:hidden mb-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filter Games
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {Object.values(filters).filter(v => v !== '').length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span>Filter Games</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto flex-1 pb-20">
              <FilterContent />
            </div>
            {/* Bottom Action Buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClearAndClose}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default GameFilters;
