import React, { useState, useEffect } from 'react';
import { Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from '@/components/ui/select';
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
  games?: any[]; // Optional array of games to determine smart default date
}

const GameFilters = ({ filters, onFilterChange, onClearFilters, showModeFilter = false, games = [] }: GameFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Pending filters for mobile - only applied when "Apply Filters" is clicked
  const [pendingFilters, setPendingFilters] = useState(filters);
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  // Sync pending filters with actual filters when they change (for desktop updates)
  useEffect(() => {
    setPendingFilters(filters);
  }, [filters]);

  // Show years from 2000 to 2025 for MLB data coverage
  const seasons = Array.from({ length: 26 }, (_, i) => 2025 - i);

  // Only MLB teams (sorted alphabetically)
  const mlbTeams = [
    'ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CWS', 'CIN', 'CLE',
    'COL', 'DET', 'HOU', 'KC', 'LAA', 'LAD', 'MIA', 'MIL',
    'MIN', 'NYM', 'NYY', 'OAK', 'PHI', 'PIT', 'SD', 'SF',
    'SEA', 'STL', 'TB', 'TEX', 'TOR', 'WSH'
  ].sort();

  // Smart default date logic
  const getSmartDefaultDate = (): Date => {
    // If a date filter is already set, use that
    if (filters.startDate) {
      try {
        const [year, month, day] = filters.startDate.split('-').map(Number);
        return new Date(year, month - 1, day);
      } catch {
        // Fall through to other logic if parsing fails
      }
    }

    // If a season filter is active, default to January of that year
    if (filters.season) {
      try {
        const year = parseInt(filters.season);
        return new Date(year, 0, 1); // January 1st of the season year
      } catch {
        // Fall through to other logic if parsing fails
      }
    }

    // If games are available, use the first game's date
    if (games.length > 0) {
      const firstGame = games[0];
      const gameDate = firstGame.date || firstGame.game_date;
      if (gameDate) {
        try {
          const [year, month, day] = gameDate.split('-').map(Number);
          return new Date(year, month - 1, day);
        } catch {
          // Fall through to current date if parsing fails
        }
      }
    }

    // Default to current date
    return new Date();
  };

  // Convert filters to selected date for the calendar
  const getSelectedDate = (filtersToUse = filters): Date | undefined => {
    if (!filtersToUse.startDate) return undefined;
    
    try {
      const [year, month, day] = filtersToUse.startDate.split('-').map(Number);
      return new Date(year, month - 1, day);
    } catch {
      return undefined;
    }
  };

  const handleDateChange = (date: Date | undefined, isMobile = false) => {
    if (date) {
      // Format as YYYY-MM-DD
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const selectedDate = formatDate(date);
      
      if (isMobile) {
        // Update pending filters for mobile
        setPendingFilters(prev => ({
          ...prev,
          startDate: selectedDate,
          endDate: selectedDate
        }));
      } else {
        // Set both start and end date to the same value for compatibility
        onFilterChange('startDate', selectedDate);
        onFilterChange('endDate', selectedDate);
      }
    } else {
      // Clear both dates if no date is selected
      if (isMobile) {
        setPendingFilters(prev => ({
          ...prev,
          startDate: '',
          endDate: ''
        }));
      } else {
        onFilterChange('startDate', '');
        onFilterChange('endDate', '');
      }
    }
  };

  // Handler for mobile filter changes (updates pending state only)
  const handleMobileFilterChange = (key: string, value: string) => {
    setPendingFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Helper function to get the display text for selected team
  const getSelectedTeamDisplay = (selectedTeam: string): string => {
    if (!selectedTeam || selectedTeam === 'all') {
      return 'All Teams';
    }

    // Handle new format: "ATL:MLB"
    if (selectedTeam.includes(':')) {
      const [teamAbbr, league] = selectedTeam.split(':');
      const teamName = formatTeamName(teamAbbr, league as 'MLB');
      return `${teamAbbr} - ${teamName}`;
    }

    // Legacy format handling (fallback)
    const mlbName = formatTeamName(selectedTeam, 'MLB');
    
    if (mlbName !== 'Unknown Team') {
      return `${selectedTeam} - ${mlbName}`;
    }

    return selectedTeam;
  };

  // Helper function to get display text for active filter badge
  const getTeamBadgeText = (selectedTeam: string): string => {
    if (selectedTeam.includes(':')) {
      const [teamAbbr, league] = selectedTeam.split(':');
      const teamName = formatTeamName(teamAbbr, league as 'MLB');
      return `${teamAbbr} - ${teamName}`;
    }
    return selectedTeam;
  };

  const handleApplyFilters = () => {
    // Apply all pending filters
    Object.entries(pendingFilters).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
    setIsOpen(false);
  };

  const handleClearAndClose = () => {
    // Clear both pending and actual filters
    const clearedFilters = {
      search: '',
      league: '',
      season: '',
      playoff: '',
      startDate: '',
      endDate: '',
      venue: '',
      mode: ''
    };
    setPendingFilters(clearedFilters);
    onClearFilters();
    setIsOpen(false);
  };

  const handleMobileClearFilters = () => {
    const clearedFilters = {
      search: '',
      league: '',
      season: '',
      playoff: '',
      startDate: '',
      endDate: '',
      venue: '',
      mode: ''
    };
    setPendingFilters(clearedFilters);
  };

  const selectedDate = getSelectedDate();
  const pendingSelectedDate = getSelectedDate(pendingFilters);
  const smartDefaultDate = getSmartDefaultDate();

  // Desktop filter content component
  const DesktopFilterContent = () => (
    <>
      <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
        {/* Teams Dropdown - MLB Only */}
        <Select value={filters.search || undefined} onValueChange={(value) => onFilterChange('search', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectGroup>
              <SelectLabel>MLB Teams</SelectLabel>
              {mlbTeams.map((team) => (
                <SelectItem key={`mlb-${team}`} value={`${team}:MLB`}>
                  {team} - {formatTeamName(team, 'MLB')}
                </SelectItem>
              ))}
            </SelectGroup>
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
              onSelect={(date) => handleDateChange(date, false)}
              defaultMonth={smartDefaultDate}
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

  // Mobile filter content component with no focus styles and pending state
  const MobileFilterContent = () => (
    <>
      <div className="grid gap-4 mb-4 grid-cols-1">
        {/* Teams Dropdown - MLB Only (Mobile) */}
        <Select value={pendingFilters.search || undefined} onValueChange={(value) => handleMobileFilterChange('search', value === 'all' ? '' : value)}>
          <SelectTrigger className="focus:ring-0 focus:ring-offset-0 outline-none">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectGroup>
              <SelectLabel>MLB Teams</SelectLabel>
              {mlbTeams.map((team) => (
                <SelectItem key={`mlb-${team}`} value={`${team}:MLB`}>
                  {team} - {formatTeamName(team, 'MLB')}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Season (Mobile) */}
        <Select value={pendingFilters.season} onValueChange={(value) => handleMobileFilterChange('season', value === 'all' ? '' : value)}>
          <SelectTrigger className="focus:ring-0 focus:ring-offset-0 outline-none">
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

        {/* Playoff (Mobile) */}
        <Select value={pendingFilters.playoff} onValueChange={(value) => handleMobileFilterChange('playoff', value === 'all' ? '' : value)}>
          <SelectTrigger className="focus:ring-0 focus:ring-offset-0 outline-none">
            <SelectValue placeholder="All Games" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            <SelectItem value="true">Playoff Games</SelectItem>
            <SelectItem value="false">Regular Season</SelectItem>
            <SelectItem value="exhibition">Exhibition</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Picker (Mobile) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal focus:ring-0 focus:ring-offset-0 outline-none",
                !pendingSelectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {pendingSelectedDate ? (
                format(pendingSelectedDate, "MMM dd, yyyy")
              ) : (
                "Select date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={pendingSelectedDate}
              onSelect={(date) => handleDateChange(date, true)}
              defaultMonth={smartDefaultDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Mode Filter - Only show on diary pages (Mobile) */}
        {showModeFilter && (
          <Select value={pendingFilters.mode || ''} onValueChange={(value) => handleMobileFilterChange('mode', value === 'all' ? '' : value)}>
            <SelectTrigger className="focus:ring-0 focus:ring-offset-0 outline-none">
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

      {/* Clear Filters Button for Mobile */}
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleMobileClearFilters}
          className="text-gray-600 hover:text-gray-900 focus:ring-0 focus:ring-offset-0 outline-none"
        >
          <X className="h-4 w-4 mr-1" />
          Clear All Filters
        </Button>
      </div>
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
        <DesktopFilterContent />
      </div>

      {/* Mobile Version */}
      <div className="md:hidden mb-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full focus:ring-0 focus:ring-offset-0 outline-none">
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
              <MobileFilterContent />
            </div>
            {/* Bottom Action Buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClearAndClose}
                  className="flex-1 focus:ring-0 focus:ring-offset-0 outline-none"
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1 focus:ring-0 focus:ring-offset-0 outline-none"
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
