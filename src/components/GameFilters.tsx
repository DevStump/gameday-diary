import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DateFilter } from './filters/DateFilter';
import { TeamFilter } from './filters/TeamFilter';
import { SeasonFilter } from './filters/SeasonFilter';
import { ActiveFilterBadges } from './filters/ActiveFilterBadges';

interface GameFiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    league: string;
    season: string;
    playoff: string;
    search: string;
    mode?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  showModeFilter?: boolean;
  games?: any[];
}

const GameFilters = ({ filters, onFilterChange, onClearFilters, showModeFilter = false, games = [] }: GameFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(filters);
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  // Sync pending filters with actual filters when they change
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
    if (filters.startDate) {
      try {
        const [year, month, day] = filters.startDate.split('-').map(Number);
        return new Date(year, month - 1, day);
      } catch {
        // Fall through to other logic if parsing fails
      }
    }

    if (filters.season) {
      try {
        const year = parseInt(filters.season);
        return new Date(year, 0, 1);
      } catch {
        // Fall through to other logic if parsing fails
      }
    }

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
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const selectedDate = formatDate(date);
      
      if (isMobile) {
        setPendingFilters(prev => ({
          ...prev,
          startDate: selectedDate,
          endDate: selectedDate
        }));
      } else {
        onFilterChange('startDate', selectedDate);
        onFilterChange('endDate', selectedDate);
      }
    } else {
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

  const handleMobileFilterChange = (key: string, value: string) => {
    setPendingFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    Object.entries(pendingFilters).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
    setIsOpen(false);
  };

  const handleClearAndClose = () => {
    const clearedFilters = {
      search: '',
      league: '',
      season: '',
      playoff: '',
      startDate: '',
      endDate: '',
      ...(showModeFilter && { mode: '' })
    };
    setPendingFilters(clearedFilters);
    onClearFilters();
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <TeamFilter
          value={filters.search}
          onChange={(value) => onFilterChange('search', value === 'all' ? '' : value)}
          teams={mlbTeams}
          className="w-48"
        />

        <SeasonFilter
          value={filters.season}
          onChange={(value) => onFilterChange('season', value === 'all' ? '' : value)}
          seasons={seasons}
          className="w-32"
        />

        <Select 
          value={filters.playoff} 
          onValueChange={(value) => onFilterChange('playoff', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Season Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            <SelectItem value="false">Regular Season</SelectItem>
            <SelectItem value="true">Playoffs Only</SelectItem>
          </SelectContent>
        </Select>

        <DateFilter
          selectedDate={getSelectedDate()}
          onDateChange={(date) => handleDateChange(date)}
          defaultDate={getSmartDefaultDate()}
          className="w-40"
        />

        {showModeFilter && (
          <Select 
            value={filters.mode || ''} 
            onValueChange={(value) => onFilterChange('mode', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Entries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entries</SelectItem>
              <SelectItem value="attended">Attended</SelectItem>
              <SelectItem value="watched">Watched</SelectItem>
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-field-green text-white rounded-full px-2 py-0.5 text-xs">
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Games</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Team</label>
                <TeamFilter
                  value={pendingFilters.search}
                  onChange={(value) => handleMobileFilterChange('search', value === 'all' ? '' : value)}
                  teams={mlbTeams}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Season</label>
                <SeasonFilter
                  value={pendingFilters.season}
                  onChange={(value) => handleMobileFilterChange('season', value === 'all' ? '' : value)}
                  seasons={seasons}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Season Type</label>
                <Select 
                  value={pendingFilters.playoff} 
                  onValueChange={(value) => handleMobileFilterChange('playoff', value === 'all' ? '' : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Games" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Games</SelectItem>
                    <SelectItem value="false">Regular Season</SelectItem>
                    <SelectItem value="true">Playoffs Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <DateFilter
                  selectedDate={getSelectedDate(pendingFilters)}
                  onDateChange={(date) => handleDateChange(date, true)}
                  defaultDate={getSmartDefaultDate()}
                  className="w-full"
                />
              </div>

              {showModeFilter && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Experience Mode</label>
                  <Select 
                    value={pendingFilters.mode || ''} 
                    onValueChange={(value) => handleMobileFilterChange('mode', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Entries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entries</SelectItem>
                      <SelectItem value="attended">Attended</SelectItem>
                      <SelectItem value="watched">Watched</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleApplyFilters} className="flex-1 bg-field-green hover:bg-field-dark">
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClearAndClose}
                  className="flex-1"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="mb-4">
          <ActiveFilterBadges
            filters={filters}
            onFilterChange={onFilterChange}
            onClearAll={onClearFilters}
            showModeFilter={showModeFilter}
          />
        </div>
      )}
    </>
  );
};

export default GameFilters;