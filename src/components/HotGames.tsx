
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getTeamLogo, getTeamAbbreviation } from '@/utils/teamLogos';

interface HotGamesProps {
  games: Array<{
    game_id: string;
    date: string;
    home_team: string;
    away_team: string;
    league: 'NFL' | 'MLB';
    venue?: string;
    diaryEntries?: number;
    boxscore_url?: string;
    is_future?: boolean;
  }>;
  onAddToDiary?: (gameId: string, gameTitle: string, homeTeam: string, awayTeam: string, league: string) => void;
  isAuthenticated?: boolean;
}

const HotGames = ({ games, onAddToDiary, isAuthenticated }: HotGamesProps) => {
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
        {hotGames.map((game, index) => {
          const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league);
          const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league);
          
          return (
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
                      alt={awayTeamAbbr}
                      className="h-6 w-6 object-contain"
                    />
                    <span className="font-medium text-sm">{awayTeamAbbr}</span>
                  </div>
                  
                  <span className="text-gray-500 text-sm">@</span>
                  
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">{homeTeamAbbr}</span>
                    <img 
                      src={getTeamLogo(game.home_team, game.league)} 
                      alt={homeTeamAbbr}
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                </div>
                
                <div className="text-center mb-3">
                  <div className="text-xs text-gray-600">
                    {new Date(game.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                {/* Add to Diary Button */}
                {onAddToDiary && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToDiary(
                        game.game_id,
                        `${game.away_team} @ ${game.home_team}`,
                        game.home_team,
                        game.away_team,
                        game.league
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full text-orange-800 border-orange-300 bg-transparent hover:bg-orange-100 transition-colors"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {isAuthenticated ? 'Add to Diary' : 'Sign in to Add'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HotGames;
