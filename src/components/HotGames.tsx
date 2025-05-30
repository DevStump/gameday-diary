
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { getTeamLogo, getTeamAbbreviation } from '@/utils/teamLogos';
import GameTeamDisplay from './game-card/GameTeamDisplay';
import GameDateTime from './game-card/GameDateTime';

interface HotGamesProps {
  games: Array<{
    game_id: string;
    date: string;
    game_datetime?: string;
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
  const [showAll, setShowAll] = useState(false);

  // Get top 3 games with highest diary entries (already consistent from useGames)
  const hotGames = games
    .filter(game => game.diaryEntries !== undefined)
    .sort((a, b) => (b.diaryEntries || 0) - (a.diaryEntries || 0))
    .slice(0, 3);

  if (hotGames.length === 0) {
    return null;
  }

  // On mobile, show only first game unless expanded
  const displayedGames = showAll ? hotGames : hotGames.slice(0, 1);
  const hasMoreGames = hotGames.length > 1;

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">🔥</span>
        <h2 className="text-2xl font-bold text-gray-900">Hot Games (Last 24 Hours)</h2>
      </div>
      
      {/* Desktop: show all 3 games in grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {hotGames.map((game, index) => {
          const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league);
          const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league);
          
          return (
            <Card key={game.game_id} className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 h-full flex flex-col">
              <CardContent className="p-4 flex-1 flex flex-col">
                {/* Top badges - fixed height */}
                <div className="flex justify-between items-start mb-3 min-h-[32px]">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                      #{index + 1} Hot
                    </Badge>
                    <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
                      {game.league}
                    </Badge>
                  </div>
                </div>

                {/* Venue row - same as regular cards */}
                {game.venue && (
                  <div className="flex items-center justify-center text-sm text-gray-600 mb-3 min-h-[20px]">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-center">{game.venue}</span>
                  </div>
                )}

                {/* Teams and logos - using same component as regular cards */}
                <div className="text-center mb-3 flex-1 flex flex-col justify-center min-h-[100px]">
                  <GameTeamDisplay 
                    homeTeam={homeTeamAbbr}
                    awayTeam={awayTeamAbbr}
                    league={game.league}
                    isFuture={game.is_future}
                  />
                </div>

                {/* Date with same format as regular cards */}
                <div className="text-center min-h-[50px] flex flex-col justify-start">
                  <GameDateTime date={game.date} gameDateTime={game.game_datetime} />
                </div>

                {/* Add to Diary Button */}
                {onAddToDiary && (
                  <div className="mt-auto pt-3">
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
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mobile: single column with expand functionality */}
      <div className="md:hidden space-y-4">
        {displayedGames.map((game, index) => {
          const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league);
          const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league);
          
          return (
            <Card key={game.game_id} className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 h-full flex flex-col">
              <CardContent className="p-4 flex-1 flex flex-col">
                {/* Top badges - fixed height */}
                <div className="flex justify-between items-start mb-3 min-h-[32px]">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                      #{index + 1} Hot
                    </Badge>
                    <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
                      {game.league}
                    </Badge>
                  </div>
                </div>

                {/* Venue row - same as regular cards */}
                {game.venue && (
                  <div className="flex items-center justify-center text-sm text-gray-600 mb-3 min-h-[20px]">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-center">{game.venue}</span>
                  </div>
                )}

                {/* Teams and logos - using same component as regular cards */}
                <div className="text-center mb-3 flex-1 flex flex-col justify-center min-h-[100px]">
                  <GameTeamDisplay 
                    homeTeam={homeTeamAbbr}
                    awayTeam={awayTeamAbbr}
                    league={game.league}
                    isFuture={game.is_future}
                  />
                </div>

                {/* Date with same format as regular cards */}
                <div className="text-center min-h-[50px] flex flex-col justify-start">
                  <GameDateTime date={game.date} gameDateTime={game.game_datetime} />
                </div>

                {/* Add to Diary Button */}
                {onAddToDiary && (
                  <div className="mt-auto pt-3">
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
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Show More/Show Less Button - only on mobile */}
        {hasMoreGames && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-3 w-3 inline mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 inline mr-1" />
                  Show More ({hotGames.length - 1} more)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotGames;
