
import React from 'react';
import { getTeamLogo } from '@/utils/teamLogos';

interface GameTeamDisplayProps {
  homeTeam: string;
  awayTeam: string;
  league: 'NFL' | 'MLB';
  isFuture?: boolean;
  gameDate?: string;
}

const GameTeamDisplay = ({ homeTeam, awayTeam, league, isFuture, gameDate }: GameTeamDisplayProps) => {
  return (
    <div className="flex items-center justify-between space-x-2 mb-3">
      {/* Away Team */}
      <div className="flex items-center space-x-2 flex-1">
        <img 
          src={getTeamLogo(awayTeam, league, gameDate)} 
          alt={awayTeam}
          className="h-8 w-8 object-contain flex-shrink-0"
        />
        <span className="text-sm font-medium text-gray-900 truncate">
          {awayTeam}
        </span>
      </div>
      
      {/* @ symbol */}
      <span className="text-gray-500 font-medium px-2">@</span>
      
      {/* Home Team */}
      <div className="flex items-center space-x-2 flex-1 justify-end">
        <span className="text-sm font-medium text-gray-900 truncate">
          {homeTeam}
        </span>
        <img 
          src={getTeamLogo(homeTeam, league, gameDate)} 
          alt={homeTeam}
          className="h-8 w-8 object-contain flex-shrink-0"
        />
      </div>
    </div>
  );
};

export default GameTeamDisplay;
