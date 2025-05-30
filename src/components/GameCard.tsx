
import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTeamAbbreviation } from '@/utils/teamLogos';
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
  };
  onAddToDiary: (gameId: string) => void;
  isAuthenticated: boolean;
}

const GameCard = ({ game, onAddToDiary, isAuthenticated }: GameCardProps) => {
  // Convert team names to abbreviations
  const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league);
  const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league);

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
          {/* Team Logos and Names */}
          <GameTeamDisplay 
            homeTeam={homeTeamAbbr}
            awayTeam={awayTeamAbbr}
            league={game.league}
            isFuture={game.is_future}
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
        <div className="w-full space-y-2">
          {/* Add to Diary Button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              onAddToDiary(game.game_id);
            }}
            className="w-full bg-field-green transition-colors"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAuthenticated ? 'Add to Diary' : 'Sign in to Add'}
          </Button>

          {/* View Boxscore Link - only show for signed-in users and not future games */}
          {isAuthenticated && !game.is_future && (
            <div className="text-center mt-2">
              <a 
                href={game.boxscore_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-500 underline hover:text-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                View Boxscore
              </a>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
