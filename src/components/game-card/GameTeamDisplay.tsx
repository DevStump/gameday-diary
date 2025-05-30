
import React from 'react';
import { getTeamLogo } from '@/utils/teamLogos';

interface GameTeamDisplayProps {
  homeTeam: string;
  awayTeam: string;
  league: 'NFL' | 'MLB';
  isFuture?: boolean;
}

const GameTeamDisplay = ({ homeTeam, awayTeam, league, isFuture }: GameTeamDisplayProps) => {
  return (
    <div className="flex items-center justify-between space-x-4 mb-1">
      {/* Away Team */}
      <div className="flex items-center space-x-2 flex-1 justify-end">
        <div className="w-10 min-w-10 flex justify-center">
          <img 
            src={getTeamLogo(awayTeam, league)} 
            alt={awayTeam}
            className={`max-h-10 max-w-10 object-scale-down ${
              isFuture ? 'opacity-70' : ''
            }`}
          />
        </div>
        <span className={`font-medium text-gray-900 text-sm sm:text-base ${
          isFuture ? 'text-gray-600' : ''
        }`}>{awayTeam}</span>
      </div>
      
      <span className="text-gray-500 font-medium text-sm sm:text-base flex-shrink-0">@</span>
      
      {/* Home Team */}
      <div className="flex items-center space-x-2 flex-1 justify-start">
        <span className={`font-medium text-gray-900 text-sm sm:text-base ${
          isFuture ? 'text-gray-600' : ''
        }`}>{homeTeam}</span>
        <div className="w-10 min-w-10 flex justify-center">
          <img 
            src={getTeamLogo(homeTeam, league)} 
            alt={homeTeam}
            className={`max-h-10 max-w-10 object-scale-down ${
              isFuture ? 'opacity-70' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default GameTeamDisplay;
