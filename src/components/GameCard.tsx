
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
    is_future?: boolean;
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
  
  // Convert team names to abbreviations with game date for historical accuracy
  const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league, game.date);
  const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league, game.date);

  // Generate boxscore URL based on league
  const generateBoxscoreUrl = () => {
    if (game.league === 'MLB') {
      const year = new Date(game.date).getFullYear();
      
      // Get the correct Baseball Reference team code
      let bbrefTeamCode = homeTeamAbbr;
      
      // Handle historical team code mappings for Baseball Reference
      if (homeTeamAbbr === 'FLA' && year <= 2002) {
        bbrefTeamCode = 'FLO'; // Florida Marlins used FLO on Baseball Reference in early years
      } else if (homeTeamAbbr === 'LAA') {
        bbrefTeamCode = 'ANA'; // Angels always use ANA on Baseball Reference
      } else {
        // Use team_code from database for Baseball Reference URL
        const mappedTeamCode = teamCodeMap[homeTeamAbbr.toUpperCase()];
        bbrefTeamCode = mappedTeamCode || homeTeamAbbr;
      }
      
      // Ensure the team code is uppercase for Baseball Reference
      bbrefTeamCode = bbrefTeamCode.toUpperCase();
      
      const date = game.date.replace(/-/g, '');
      
      // Handle doubleheader games
      let gameNumber = '0';
      if (game.doubleheader === 'S' && game.game_num) {
        gameNumber = game.game_num.toString();
      }
      
      console.log(`Generating MLB boxscore URL: team=${game.home_team}, abbr=${homeTeamAbbr}, bbref_code=${bbrefTeamCode}, date=${date}, game=${gameNumber}`);
      return `https://www.baseball-reference.com/boxes/${bbrefTeamCode}/${bbrefTeamCode}${date}${gameNumber}.shtml`;
    } else {
      // Use existing boxscore_url for NFL
      return game.boxscore_url;
    }
  };

  // Check if boxscore should be shown
  const shouldShowBoxscore = () => {
    if (game.is_future) return false;
    
    // For MLB games, check if pitcher data is available (indicates boxscore is ready)
    if (game.league === 'MLB') {
      const hasWinningPitcher = game.winning_pitcher && game.winning_pitcher.trim() !== '';
      const hasLosingPitcher = game.losing_pitcher && game.losing_pitcher.trim() !== '';
      const hasSavePitcher = game.save_pitcher && game.save_pitcher.trim() !== '';
      
      // If all pitcher fields are empty, don't show boxscore link
      return hasWinningPitcher || hasLosingPitcher || hasSavePitcher;
    }
    
    // For NFL games, always show if not future and has boxscore URL
    return !!game.boxscore_url;
  };

  const getStatusTag = () => {
    // Check game_type for MLB games
    if (game.game_type === 'E') {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          Exhibition
        </Badge>
      );
    }
    
    if (game.game_type === 'S') {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          Spring Training
        </Badge>
      );
    }

    // Check for playoff games
    if (game.playoff) {
      return (
        <Badge variant="outline" className="border-sports-gold text-sports-gold">
          Playoff
        </Badge>
      );
    }
    
    return null;
  };

  const statusTag = getStatusTag();

  return (
    <Card className={`transition-shadow duration-200 animate-fade-in h-full flex flex-col ${
      game.is_future ? 'bg-gray-50' : ''
    }`}>
      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Top badges - fixed height */}
        <div className="flex justify-between items-start mb-3 min-h-[32px]">
          <div className="flex items-center space-x-2 flex-wrap">
            <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
              {game.league}
            </Badge>
            {statusTag}
          </div>
        </div>

        {/* Venue row - full width without character limit */}
        {game.venue && (
          <div className="flex items-center justify-center text-sm text-gray-600 mb-3 min-h-[20px]">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-center">{game.venue}</span>
          </div>
        )}

        {/* Teams and Score - fixed height container */}
        <div className="text-center mb-3 flex-1 flex flex-col justify-center min-h-[100px]">
          {/* Team Logos and Names - pass game date for historical logos */}
          <GameTeamDisplay 
            homeTeam={homeTeamAbbr}
            awayTeam={awayTeamAbbr}
            league={game.league}
            isFuture={game.is_future}
            gameDate={game.date}
          />
          
          {/* Score/Status container - fixed height */}
          <GameScore 
            league={game.league}
            ptsOff={game.pts_off}
            ptsDef={game.pts_def}
            runsScored={game.runs_scored}
            runsAllowed={game.runs_allowed}
            isFuture={game.is_future}
          />
        </div>

        {/* Date and additional info - fixed height container */}
        <div className="text-center min-h-[50px] flex flex-col justify-start">
          <GameDateTime date={game.date} gameDateTime={game.game_datetime} />
          
          {/* Additional info container - fixed height */}
          <GamePitchers 
            isFuture={game.is_future}
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

      {/* Vertical divider with margins */}
      <div className="border-t border-gray-200 mx-4"></div>

      <CardFooter className="p-4 pt-3">
        <div className="w-full">
          {/* Dual Button Layout */}
          <div className="flex gap-x-2">
            {/* Add to Diary Button */}
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

            {/* View Boxscore Button - only show for signed-in users and when boxscore is ready */}
            {isAuthenticated && shouldShowBoxscore() && (
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
