
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp, MapPin, Check, ExternalLink } from 'lucide-react';
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
    doubleheader?: string;
    game_num?: number;
  }>;
  onAddToDiary?: (gameId: string, gameTitle: string, homeTeam: string, awayTeam: string, league: string, venue?: string) => void;
  isAuthenticated?: boolean;
}

const HotGames = ({ games, onAddToDiary, isAuthenticated }: HotGamesProps) => {
  const [showAll, setShowAll] = useState(false);
  
  // Only fetch game logs if user is authenticated
  const { data: gameLogs } = useGameLogs({
    enabled: !!isAuthenticated
  });

  // Create set of logged game IDs for quick lookup (only if authenticated)
  const loggedGameIds = isAuthenticated 
    ? new Set(gameLogs?.map(log => String(log.game_id)) || []) 
    : new Set();

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

  const generateBoxscoreUrl = (game: typeof hotGames[0]) => {
    const year = new Date(game.date).getFullYear();
    const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league, game.date);
    const date = game.date.replace(/-/g, '');
    const gameNumber = game.doubleheader === 'S' && game.game_num ? game.game_num.toString() : '0';
    return `https://www.baseball-reference.com/boxes/${homeTeamAbbr}/${homeTeamAbbr}${date}${gameNumber}.shtml`;
  };

  const renderGameCard = (game: typeof hotGames[0], index: number) => {
    const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league, game.date);
    const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league, game.date);
    const isLogged = isAuthenticated && loggedGameIds.has(String(game.game_id));
    
    return (
      <Card 
        key={game.game_id} 
        className="bg-[#FFF8F3] border-[#FFE3C8] border rounded-xl shadow-sm h-full flex flex-col"
      >
        <CardContent className="p-5 flex flex-col flex-1">
          {/* Top Label Row */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#FFF7ED] text-[#B45309] border-none font-semibold text-sm px-2 py-1 rounded-full">
                #{index + 1} Hot
              </Badge>
              <Badge className="bg-[#166534] text-white font-bold text-sm px-3 py-1 rounded-full">
                {game.league}
              </Badge>
            </div>
          </div>

          {/* Venue Row */}
          {game.venue && (
            <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-center">{game.venue}</span>
            </div>
          )}

          {/* Team Matchup Row */}
          <div className="flex items-center justify-center gap-x-3 mb-3">
            <div className="flex items-center gap-x-2">
              <img 
                src={`https://www.mlbstatic.com/team-logos/${awayTeamAbbr}.svg`}
                alt={awayTeamAbbr}
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <span className="text-xl font-bold">{awayTeamAbbr}</span>
            </div>
            <span className="text-gray-500 font-medium text-xl">@</span>
            <div className="flex items-center gap-x-2">
              <span className="text-xl font-bold">{homeTeamAbbr}</span>
              <img 
                src={`https://www.mlbstatic.com/team-logos/${homeTeamAbbr}.svg`}
                alt={homeTeamAbbr}
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          {/* Score Row */}
          <div className="text-center mb-3">
            {game.runs_scored !== undefined && game.runs_allowed !== undefined && 
             !game.is_future && (game.runs_scored !== 0 || game.runs_allowed !== 0) ? (
              <div className="text-2xl font-bold">
                <span className={game.runs_allowed > game.runs_scored ? 'text-green-700' : 'text-gray-600'}>
                  {game.runs_allowed}
                </span>
                <span className="text-gray-600 mx-2">-</span>
                <span className={game.runs_scored > game.runs_allowed ? 'text-green-700' : 'text-gray-600'}>
                  {game.runs_scored}
                </span>
              </div>
            ) : (
              <div className="text-lg text-gray-500 font-medium">Scheduled</div>
            )}
          </div>

          {/* Date + Time */}
          <div className="text-center mb-4">
            <GameDateTime date={game.date} gameDateTime={game.game_datetime} />
          </div>

          {/* Call-to-Action Button - grows to fill remaining space */}
          <div className="mt-auto">
            {onAddToDiary && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLogged) {
                    const gameId = String(game.game_id).trim();
                    console.log('Hot Games - calling onAddToDiary with gameId:', gameId);
                    
                    if (gameId && gameId !== 'null' && gameId !== 'undefined') {
                      onAddToDiary(
                        gameId,
                        `${game.away_team} @ ${game.home_team}`,
                        game.home_team,
                        game.away_team,
                        game.league,
                        game.venue
                      );
                    } else {
                      console.error('Invalid game ID in Hot Games:', game.game_id);
                    }
                  }
                }}
                variant={isLogged ? "secondary" : "outline"}
                disabled={isLogged}
                className={`w-full transition-colors text-sm py-3 rounded-lg ${
                  isLogged 
                    ? 'bg-green-100 text-green-800 border-green-300 cursor-not-allowed' 
                    : 'text-[#B45309] border-[#FACC15] bg-transparent hover:bg-[#FFF7ED]'
                }`}
              >
                {isLogged ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Added
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    {isAuthenticated ? 'Add to Diary' : 'Sign in to Add'}
                  </>
                )}
              </Button>
            )}
          </div>
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
