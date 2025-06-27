import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from '@/components/ui/select';
import { formatTeamName } from '@/utils/teamLogos';

interface TeamFilterProps {
  value: string;
  onChange: (value: string) => void;
  teams: string[];
  placeholder?: string;
  className?: string;
}

export const TeamFilter = ({ 
  value, 
  onChange, 
  teams,
  placeholder = "All Teams",
  className 
}: TeamFilterProps) => {
  // Helper function to get the display text for selected team
  const getSelectedTeamDisplay = (selectedTeam: string): string => {
    if (!selectedTeam || selectedTeam === 'all') {
      return placeholder;
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

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {getSelectedTeamDisplay(value)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        <SelectGroup>
          <SelectLabel>MLB Teams</SelectLabel>
          {teams.map((team) => (
            <SelectItem key={team} value={`${team}:MLB`}>
              {team} - {formatTeamName(team, 'MLB')}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};