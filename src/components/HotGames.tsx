
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTeamLogo, formatTeamName } from '@/utils/teamLogos';

interface HotGamesProps {
  games: Array<{
    game_id: string;
    date: string;
    home_team: string;
    away_team: string;
    league: 'NFL' | 'MLB';
    venue?: string;
  }>;
}

const HotGames = ({ games }: HotGamesProps) => {
  // Generate hot games with random diary entries (sorted high to low)
  const hotGames = games
    .slice(0, 10) // Take first 10 games
    .map(game => ({
      ...game,
      diaryEntries: Math.floor(Math.random() * (10000 - 500 + 1)) + 500 // Higher range for hot games
    }))
    .sort((a, b) => b.diaryEntries - a.diaryEntries)
    .slice(0, 3); // Take top 3

  if (hotGames.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">🔥</span>
        <h2 className="text-2xl font-bold text-gray-900">Hot Games (Last 24 Hours)</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hotGames.map((game, index) => (
          <Card key={game.game_id} className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                  #{index + 1} Hot
                </Badge>
                <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
                  {game.league}
                </Badge>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  <img 
                    src={getTeamLogo(game.away_team, game.league)} 
                    alt={game.away_team}
                    className="h-6 w-6 object-contain"
                  />
                  <span className="font-medium text-sm">{formatTeamName(game.away_team, game.league)}</span>
                </div>
                
                <span className="text-gray-500 text-sm">@</span>
                
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-sm">{formatTeamName(game.home_team, game.league)}</span>
                  <img 
                    src={getTeamLogo(game.home_team, game.league)} 
                    alt={game.home_team}
                    className="h-6 w-6 object-contain"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  📖 {game.diaryEntries.toLocaleString()} entries
                </div>
                <div className="text-xs text-gray-600">
                  {new Date(game.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HotGames;
