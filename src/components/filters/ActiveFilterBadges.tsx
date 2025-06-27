import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTeamName } from '@/utils/teamLogos';

interface ActiveFilterBadgesProps {
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
  onClearAll: () => void;
  showModeFilter?: boolean;
}

export const ActiveFilterBadges = ({ 
  filters, 
  onFilterChange, 
  onClearAll,
  showModeFilter = false
}: ActiveFilterBadgesProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  if (!hasActiveFilters) return null;

  // Helper function to get team badge text
  const getTeamBadgeText = (selectedTeam: string): string => {
    if (selectedTeam.includes(':')) {
      const [teamAbbr, league] = selectedTeam.split(':');
      const teamName = formatTeamName(teamAbbr, league as 'MLB');
      return `${teamAbbr} - ${teamName}`;
    }
    return selectedTeam;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.search && (
        <Badge variant="secondary" className="pr-1">
          Team: {getTeamBadgeText(filters.search)}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
            onClick={() => onFilterChange('search', '')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {filters.season && filters.season !== 'all' && (
        <Badge variant="secondary" className="pr-1">
          Season: {filters.season}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
            onClick={() => onFilterChange('season', '')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {filters.playoff === 'true' && (
        <Badge variant="secondary" className="pr-1">
          Playoffs Only
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
            onClick={() => onFilterChange('playoff', '')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {filters.startDate && (
        <Badge variant="secondary" className="pr-1">
          Date: {filters.startDate}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
            onClick={() => {
              onFilterChange('startDate', '');
              onFilterChange('endDate', '');
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {showModeFilter && filters.mode && (
        <Badge variant="secondary" className="pr-1">
          {filters.mode === 'attended' ? 'Attended' : 'Watched'}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
            onClick={() => onFilterChange('mode', '')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs"
      >
        Clear All
      </Button>
    </div>
  );
};