import React from 'react';
import { Search, Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const GameFilters = ({ filters, onFilterChange, onClearFilters }: GameFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  // Only show 2024 and 2025 seasons
  const seasons = [2025, 2024];

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

  const handleDateChange = (date: Date | undefined, type: 'startDate' | 'endDate') => {
    if (date) {
      // Format as YYYY-MM-DD to match database format (no timezone)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      onFilterChange(type, dateString);
    } else {
      onFilterChange(type, '');
    }
  };

  // Helper function to parse date string safely
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    try {
      // Parse YYYY-MM-DD format directly
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    } catch {
      return undefined;
    }
  };

  // Helper function to get the display text for selected team
  const getSelectedTeamDisplay = (selectedTeam: string, leagueFilter: string): string => {
    if (!selectedTeam || selectedTeam === 'all') {
      return 'All Teams';
    }

    // Try NFL first if no league filter or NFL is selected
    if (!leagueFilter || leagueFilter === 'NFL') {
      if (nflTeams.includes(selectedTeam)) {
        return `${selectedTeam} - ${formatTeamName(selectedTeam, 'NFL')}`;
      }
    }

    // Try MLB if no league filter or MLB is selected
    if (!leagueFilter || leagueFilter === 'MLB') {
      if (mlbTeams.includes(selectedTeam)) {
        return `${selectedTeam} - ${formatTeamName(selectedTeam, 'MLB')}`;
      }
    }

    // Fallback - try both leagues
    const nflName = formatTeamName(selectedTeam, 'NFL');
    const mlbName = formatTeamName(selectedTeam, 'MLB');
    
    if (nflName !== 'Unknown Team') {
      return `${selectedTeam} - ${nflName}`;
    } else if (mlbName !== 'Unknown Team') {
      return `${selectedTeam} - ${mlbName}`;
    }

    return selectedTeam;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
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
              {getSelectedTeamDisplay(filters.search, filters.league)}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {(!filters.league || filters.league === 'NFL') && (
              <>
                <SelectGroup>
                  <SelectLabel>NFL Teams</SelectLabel>
                  {nflTeams.map((team) => (
                    <SelectItem key={`nfl-${team}`} value={team}>
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
                  <SelectItem key={`mlb-${team}`} value={team}>
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
          </SelectContent>
        </Select>

        {/* Start Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !filters.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? format(parseDate(filters.startDate) || new Date(), "MMM dd, yyyy") : "Start Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={parseDate(filters.startDate)}
              onSelect={(date) => handleDateChange(date, 'startDate')}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* End Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !filters.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? format(parseDate(filters.endDate) || new Date(), "MMM dd, yyyy") : "End Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={parseDate(filters.endDate)}
              onSelect={(date) => handleDateChange(date, 'endDate')}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Team: {filters.search}</span>
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
              <span>{filters.playoff === 'true' ? 'Playoff Games' : 'Regular Season'}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => onFilterChange('playoff', '')}
              />
            </Badge>
          )}
          {filters.startDate && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>From: {format(parseDate(filters.startDate) || new Date(), "MMM dd, yyyy")}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => onFilterChange('startDate', '')}
              />
            </Badge>
          )}
          {filters.endDate && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>To: {format(parseDate(filters.endDate) || new Date(), "MMM dd, yyyy")}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => onFilterChange('endDate', '')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default GameFilters;
