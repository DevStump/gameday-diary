
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
    <div className="flex items-center justify-center space-x-4 mb-2">
      {/* Away Team */}
      <div className="flex items-center space-x-2 min-w-0 flex-1 justify-end">
        <div className="flex items-center space-x-1">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <img 
              src={getTeamLogo(awayTeam, league)} 
              alt={awayTeam}
              className={`max-h-10 max-w-10 object-contain ${
                isFuture ? 'opacity-70' : ''
              }`}
            />
          </div>
          <span className={`font-medium text-gray-900 text-sm sm:text-base whitespace-nowrap ${
            isFuture ? 'text-gray-600' : ''
          }`}>{awayTeam}</span>
        </div>
      </div>
      
      <span className="text-gray-500 font-medium text-sm sm:text-base flex-shrink-0 px-2">@</span>
      
      {/* Home Team */}
      <div className="flex items-center space-x-2 min-w-0 flex-1 justify-start">
        <div className="flex items-center space-x-1">
          <span className={`font-medium text-gray-900 text-sm sm:text-base whitespace-nowrap ${
            isFuture ? 'text-gray-600' : ''
          }`}>{homeTeam}</span>
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <img 
              src={getTeamLogo(homeTeam, league)} 
              alt={homeTeam}
              className={`max-h-10 max-w-10 object-contain ${
                isFuture ? 'opacity-70' : ''
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTeamDisplay;
