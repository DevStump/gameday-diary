
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTeamLogo } from '@/utils/teamLogos';

interface HotGamesProps {
  games: Array<{
    game_id: string;
    date: string;
    home_team: string;
    away_team: string;
    league: 'NFL' | 'MLB';
    venue?: string;
    diaryEntries?: number;
  }>;
}

const HotGames = ({ games }: HotGamesProps) => {
  // Get top 3 games with highest diary entries (already consistent from useGames)
  const hotGames = games
    .filter(game => game.diaryEntries !== undefined)
    .sort((a, b) => (b.diaryEntries || 0) - (a.diaryEntries || 0))
    .slice(0, 3);

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
                  <span className="font-medium text-sm">{game.away_team}</span>
                </div>
                
                <span className="text-gray-500 text-sm">@</span>
                
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-sm">{game.home_team}</span>
                  <img 
                    src={getTeamLogo(game.home_team, game.league)} 
                    alt={game.home_team}
                    className="h-6 w-6 object-contain"
                  />
                </div>
              </div>
              
              <div className="text-center">
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
