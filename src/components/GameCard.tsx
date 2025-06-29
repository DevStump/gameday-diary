import React from 'react';
import { MapPin, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getTeamAbbreviation } from '@/utils/teamLogos';
import { generateBoxscoreUrl } from '@/utils/team-mappings';
import GameTeamDisplay from './game-card/GameTeamDisplay';
import GameScore from './game-card/GameScore';
import GameDateTime from './game-card/GameDateTime';
import GamePitchers from './game-card/GamePitchers';

interface GameCardProps {
  game: {
    game_id: string;
    date: string;
    game_datetime?: string;
    home_team: string;
    away_team: string;
    league: 'MLB';
    pts_off?: number;
    pts_def?: number;
    runs_scored?: number;
    runs_allowed?: number;
    playoff?: boolean;
    venue?: string;
    boxscore_url?: string;
    status?: string;
    game_type?: string;
    home_probable_pitcher?: string;
    away_probable_pitcher?: string;
    diaryEntries?: number;
    doubleheader?: string;
    game_num?: number;
  };
  onAddToDiary: (gameId: string, gameTitle: string, homeTeam: string, awayTeam: string, league: string, venue?: string) => void;
  isAuthenticated: boolean;
  hideDiaryButton?: boolean;
  isAlreadyLogged?: boolean;
}

const GameCard = ({ game, onAddToDiary, isAuthenticated, hideDiaryButton = false, isAlreadyLogged = false }: GameCardProps) => {
  const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league, game.date);
  const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league, game.date);

  const getBoxscoreUrl = () => {
    // Use the new utility function from team-mappings
    const gameNumber = game.doubleheader === 'S' && game.game_num ? game.game_num.toString() : '0';
    return generateBoxscoreUrl(homeTeamAbbr, game.date, gameNumber);
  };

  const getStatusTag = () => {
    if (game.game_type === 'E') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Exhibition</Badge>;
    }
    if (game.game_type === 'S') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Spring Training</Badge>;
    }
    if (game.playoff) {
      return <Badge variant="outline" className="border-sports-gold text-sports-gold">Playoff</Badge>;
    }
    return null;
  };

  const shouldShowBoxscore = () => {
    const gameDate = new Date(game.date);
    const now = new Date();
    
    // Create the cutoff time: 3 AM EST the day after the game
    const cutoffDate = new Date(gameDate);
    cutoffDate.setDate(cutoffDate.getDate() + 1);
    cutoffDate.setHours(8, 0, 0, 0); // 3 AM EST = 8 AM UTC (assuming EST, not EDT)
    
    return now >= cutoffDate;
  };

  const statusTag = getStatusTag();
  const isBeforeToday = new Date(game.date) <= new Date(new Date().toDateString());

  const handleAddClick = () => {
    if (!isAuthenticated) {
      // Handle unauthenticated case - this should redirect to auth
      onAddToDiary(game.game_id?.toString() || '', '', '', '', '', game.venue);
      return;
    }
    
    const gameTitle = `${awayTeamAbbr} @ ${homeTeamAbbr}`;
    const gameIdString = game.game_id?.toString() || '';
    
    onAddToDiary(gameIdString, gameTitle, game.home_team, game.away_team, game.league, game.venue);
  };

  return (
    <TooltipProvider>
      <Card className="transition-shadow duration-200 animate-fade-in h-full flex flex-col">
        <CardContent className="p-3 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2 min-h-[24px]">
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant="secondary" className="bg-field-green text-white">
                {game.league}
              </Badge>
              {statusTag}
            </div>
          </div>

          {game.venue && (
            <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-center">{game.venue}</span>
            </div>
          )}

          <div className="text-center mb-1 flex-1 flex flex-col justify-center min-h-[60px]">
            <GameTeamDisplay 
              homeTeam={homeTeamAbbr}
              awayTeam={awayTeamAbbr}
              league={game.league}
              gameDate={game.date}
            />
            <GameScore 
              league={game.league}
              ptsOff={game.pts_off}
              ptsDef={game.pts_def}
              runsScored={game.runs_scored}
              runsAllowed={game.runs_allowed}
            />
          </div>

          <div className="text-center min-h-[30px] flex flex-col justify-start">
            <GameDateTime date={game.date} gameDateTime={game.game_datetime} />
            <GamePitchers 
              awayProbablePitcher={game.away_probable_pitcher}
              homeProbablePitcher={game.home_probable_pitcher}
              awayTeam={awayTeamAbbr}
              homeTeam={homeTeamAbbr}
              isFuture={!game.runs_scored && !game.runs_allowed && game.status !== 'Final'}
            />
          </div>
        </CardContent>

        {!hideDiaryButton && (
          <>
            <div className="border-t border-gray-200 mx-3"></div>

            <CardFooter className="p-3 pt-2">
              <div className="w-full">
                <div className="flex gap-x-2">
                  {isAlreadyLogged ? (
                    <Button
                      disabled
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-500 cursor-default"
                      size="sm"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Added
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddClick}
                      className="flex-1 bg-field-green transition-colors"
                      size="sm"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      {isAuthenticated ? 'Add' : 'Sign in to Add'}
                    </Button>
                  )}

                  {isAuthenticated && isBeforeToday && shouldShowBoxscore() && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={getBoxscoreUrl()} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-field-green text-field-green bg-transparent hover:bg-field-light transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Boxscore
                          </Button>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Boxscores are typically available the morning after a game</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </TooltipProvider>
  );
};

export default GameCard;
