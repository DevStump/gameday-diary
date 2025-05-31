
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp, MapPin, Check } from 'lucide-react';
import { getTeamAbbreviation } from '@/utils/teamLogos';
import GameTeamDisplay from './game-card/GameTeamDisplay';
import GameDateTime from './game-card/GameDateTime';
import GameScore from './game-card/GameScore';
import { useGameLogs } from '@/hooks/useGameLogs';

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
    pts_off?: number;
    pts_def?: number;
    runs_scored?: number;
    runs_allowed?: number;
  }>;
  onAddToDiary?: (gameId: string, gameTitle: string, homeTeam: string, awayTeam: string, league: string) => void;
  isAuthenticated?: boolean;
}

const HotGames = ({ games, onAddToDiary, isAuthenticated }: HotGamesProps) => {
  const [showAll, setShowAll] = useState(false);
  const { data: gameLogs } = useGameLogs();

  // Create set of logged game IDs for quick lookup
  const loggedGameIds = new Set(gameLogs?.map(log => String(log.game_id)) || []);

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

  const renderGameCard = (game: typeof hotGames[0], index: number) => {
    const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league, game.date);
    const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league, game.date);
    const isLogged = loggedGameIds.has(String(game.game_id));
    
    return (
      <Card 
        key={game.game_id} 
        className={`bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 ${
          isLogged ? 'opacity-60' : ''
        }`}
      >
        <CardContent className="p-3">
          {/* Top badges - compact */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs px-2 py-0.5">
                #{index + 1} Hot
              </Badge>
              <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white text-xs px-2 py-0.5">
                {game.league}
              </Badge>
              {isLogged && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs px-2 py-0.5">
                  <Check className="h-3 w-3 mr-1" />
                  Added
                </Badge>
              )}
            </div>
          </div>

          {/* Venue row - compact */}
          {game.venue && (
            <div className="flex items-center justify-center text-xs text-gray-600 mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-center truncate">{game.venue}</span>
            </div>
          )}

          {/* Teams and logos - compact */}
          <div className="text-center mb-2">
            <GameTeamDisplay 
              homeTeam={homeTeamAbbr}
              awayTeam={awayTeamAbbr}
              league={game.league}
              isFuture={game.is_future}
              gameDate={game.date}
            />
          </div>

          {/* Score - compact */}
          <div className="text-center mb-2">
            <GameScore 
              league={game.league}
              ptsOff={game.pts_off}
              ptsDef={game.pts_def}
              runsScored={game.runs_scored}
              runsAllowed={game.runs_allowed}
              isFuture={game.is_future}
            />
          </div>

          {/* Date - compact */}
          <div className="text-center mb-2">
            <GameDateTime date={game.date} gameDateTime={game.game_datetime} />
          </div>

          {/* Add to Diary Button - compact */}
          {onAddToDiary && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                if (!isLogged) {
                  onAddToDiary(
                    game.game_id,
                    `${game.away_team} @ ${game.home_team}`,
                    game.home_team,
                    game.away_team,
                    game.league
                  );
                }
              }}
              variant={isLogged ? "secondary" : "outline"}
              size="sm"
              disabled={isLogged}
              className={`w-full transition-colors text-xs py-1 ${
                isLogged 
                  ? 'bg-green-100 text-green-800 border-green-300 cursor-not-allowed' 
                  : 'text-orange-800 border-orange-300 bg-transparent hover:bg-orange-100'
              }`}
            >
              {isLogged ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <BookOpen className="h-3 w-3 mr-1" />
                  {isAuthenticated ? 'Add' : 'Sign in to Add'}
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">🔥</span>
        <h2 className="text-2xl font-bold text-gray-900">Hot Games (Past 3 Days)</h2>
      </div>
      
      {/* Desktop: show all 3 games in grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {hotGames.map((game, index) => renderGameCard(game, index))}
      </div>

      {/* Mobile: single column with expand functionality */}
      <div className="md:hidden space-y-3">
        {displayedGames.map((game, index) => renderGameCard(game, index))}

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
