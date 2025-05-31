
import React from 'react';
import { MapPin, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTeamAbbreviation } from '@/utils/teamLogos';
import { useMLBTeamCodes } from '@/hooks/useMLBTeamCodes';
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
    league: 'NFL' | 'MLB';
    pts_off?: number;
    pts_def?: number;
    runs_scored?: number;
    runs_allowed?: number;
    playoff?: boolean;
    venue?: string;
    boxscore_url?: string;
    status?: string;
    game_type?: string;
    winning_pitcher?: string;
    losing_pitcher?: string;
    save_pitcher?: string;
    home_probable_pitcher?: string;
    away_probable_pitcher?: string;
    diaryEntries?: number;
    doubleheader?: string;
    game_num?: number;
  };
  onAddToDiary: (gameId: string) => void;
  isAuthenticated: boolean;
}

const GameCard = ({ game, onAddToDiary, isAuthenticated }: GameCardProps) => {
  const { data: teamCodeMap = {} } = useMLBTeamCodes();

  const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league, game.date);
  const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league, game.date);

  const generateBoxscoreUrl = () => {
    if (game.league === 'MLB') {
      const year = new Date(game.date).getFullYear();
      let bbrefTeamCode = homeTeamAbbr;

      if (homeTeamAbbr === 'FLA' && year <= 2002) {
        bbrefTeamCode = 'FLO';
      } else if (homeTeamAbbr === 'LAA') {
        bbrefTeamCode = 'ANA';
      } else {
        const mappedTeamCode = teamCodeMap[homeTeamAbbr.toUpperCase()];
        bbrefTeamCode = mappedTeamCode || homeTeamAbbr;
      }

      bbrefTeamCode = bbrefTeamCode.toUpperCase();
      const date = game.date.replace(/-/g, '');
      const gameNumber = game.doubleheader === 'S' && game.game_num ? game.game_num.toString() : '0';

      return `https://www.baseball-reference.com/boxes/${bbrefTeamCode}/${bbrefTeamCode}${date}${gameNumber}.shtml`;
    } else {
      return game.boxscore_url;
    }
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

  const statusTag = getStatusTag();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isBeforeToday = new Date(game.date) <= new Date(yesterday.toDateString());

  return (
    <Card className="transition-shadow duration-200 animate-fade-in h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3 min-h-[32px]">
          <div className="flex items-center space-x-2 flex-wrap">
            <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
              {game.league}
            </Badge>
            {statusTag}
          </div>
        </div>

        {game.venue && (
          <div className="flex items-center justify-center text-sm text-gray-600 mb-2 min-h-[20px]">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-center">{game.venue}</span>
          </div>
        )}

        <div className="text-center mb-2 flex-1 flex flex-col justify-center min-h-[100px]">
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

        <div className="text-center min-h-[50px] flex flex-col justify-start">
          <GameDateTime date={game.date} gameDateTime={game.game_datetime} />
          <GamePitchers 
            awayProbablePitcher={game.away_probable_pitcher}
            homeProbablePitcher={game.home_probable_pitcher}
            awayTeam={awayTeamAbbr}
            homeTeam={homeTeamAbbr}
            winningPitcher={game.winning_pitcher}
            losingPitcher={game.losing_pitcher}
            savePitcher={game.save_pitcher}
          />
        </div>
      </CardContent>

      <div className="border-t border-gray-200 mx-4"></div>

      <CardFooter className="p-4 pt-3">
        <div className="w-full">
          <div className="flex gap-x-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                onAddToDiary(game.game_id);
              }}
              className="flex-1 bg-field-green transition-colors"
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {isAuthenticated ? 'Add' : 'Sign in to Add'}
            </Button>

            {isAuthenticated && isBeforeToday && (
              <a 
                href={generateBoxscoreUrl()} 
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
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
