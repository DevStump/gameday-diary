
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
    <div className="flex items-center justify-center gap-x-1.5 mb-2">
      {/* Away Team - Fixed width container */}
      <div className="flex items-center gap-x-2 w-[100px] justify-end">
        <img 
          src={getTeamLogo(awayTeam, league, gameDate)} 
          alt={awayTeam}
          className="h-10 w-10 object-contain flex-shrink-0 team-logo"
          style={{
            filter: 'drop-shadow(0 0 0 transparent)',
            mixBlendMode: 'multiply'
          }}
        />
        <span className="text-sm font-medium text-gray-900">
          {awayTeam}
        </span>
      </div>
      
      {/* @ symbol - Fixed width center container */}
      <div className="w-[24px] text-center">
        <span className="text-gray-500 font-medium">@</span>
      </div>
      
      {/* Home Team - Fixed width container */}
      <div className="flex items-center gap-x-2 w-[100px] justify-start">
        <span className="text-sm font-medium text-gray-900">
          {homeTeam}
        </span>
        <img 
          src={getTeamLogo(homeTeam, league, gameDate)} 
          alt={homeTeam}
          className="h-10 w-10 object-contain flex-shrink-0 team-logo"
          style={{
            filter: 'drop-shadow(0 0 0 transparent)',
            mixBlendMode: 'multiply'
          }}
        />
      </div>
    </div>
  );
};

export default GameTeamDisplay;
