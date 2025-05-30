import React from 'react';
import { Calendar, MapPin, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { getTeamLogo, formatTeamName } from '@/utils/teamLogos';

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
  };
  onAddToDiary: (gameId: string) => void;
  isAuthenticated: boolean;
}

const GameCard = ({ game, onAddToDiary, isAuthenticated }: GameCardProps) => {
  const formatDateTime = (dateString: string, datetimeString?: string) => {
    if (datetimeString) {
      try {
        const date = new Date(datetimeString);
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'America/New_York',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        };
        return date.toLocaleDateString('en-US', options) + ' EST';
      } catch (e) {
        console.error('Error parsing datetime:', e);
      }
    }
    
    // Fallback to date string formatting
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[parseInt(month) - 1];
      
      return `${monthName} ${parseInt(day)}, ${year}`;
    }
    
    return dateString;
  };

  const getScore = () => {
    if (game.league === 'NFL' && game.pts_off !== undefined && game.pts_def !== undefined) {
      // Only return score if both values are not null/0 or if it's not a future game
      if (!game.is_future && (game.pts_off !== 0 || game.pts_def !== 0)) {
        return `${game.pts_def} - ${game.pts_off}`;
      }
    }
    if (game.league === 'MLB' && game.runs_scored !== undefined && game.runs_allowed !== undefined) {
      // Only return score if both values are not null/0 or if it's not a future game
      if (!game.is_future && (game.runs_scored !== 0 || game.runs_allowed !== 0)) {
        return `${game.runs_allowed} - ${game.runs_scored}`;
      }
    }
    return null;
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

  const getProbablePitchers = () => {
    if (!game.is_future || !game.away_probable_pitcher || !game.home_probable_pitcher) {
      return null;
    }
    
    return (
      <div className="text-sm text-gray-600">
        <span className="font-medium">Probable Pitchers:</span> {game.away_probable_pitcher} ({formatTeamName(game.away_team, game.league)}) vs. {game.home_probable_pitcher} ({formatTeamName(game.home_team, game.league)})
      </div>
    );
  };

  const getPitchingResults = () => {
    if (game.is_future) return null;
    
    const results = [];
    if (game.winning_pitcher) results.push(`WP: ${game.winning_pitcher}`);
    if (game.losing_pitcher) results.push(`LP: ${game.losing_pitcher}`);
    if (game.save_pitcher) results.push(`SV: ${game.save_pitcher}`);
    
    if (results.length === 0) return null;
    
    return (
      <div className="text-sm text-gray-600">
        {results.join(', ')}
      </div>
    );
  };

  // Limit venue text to prevent line breaks
  const formatVenue = (venue?: string) => {
    if (!venue) return null;
    // Limit to 12 characters and add ellipsis if longer
    return venue.length > 12 ? `${venue.substring(0, 12)}...` : venue;
  };

  const score = getScore();
  const statusTag = getStatusTag();
  const probablePitchers = getProbablePitchers();
  const pitchingResults = getPitchingResults();

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 animate-fade-in h-full flex flex-col ${
      game.is_future ? 'bg-gray-50' : ''
    }`}>
      <Link 
        to={`/game/${game.league.toLowerCase()}/${game.game_id}`}
        className="block flex-1 flex flex-col"
      >
        <CardContent className="p-4 cursor-pointer flex-1 flex flex-col">
          {/* Top badges - fixed height */}
          <div className="flex justify-between items-start mb-2 min-h-[32px]">
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
                {game.league}
              </Badge>
              {statusTag}
            </div>
            {game.venue && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{formatVenue(game.venue)}</span>
              </div>
            )}
          </div>

          {/* Teams and Score - fixed height container */}
          <div className="text-center mb-1 flex-1 flex flex-col justify-center min-h-[100px]">
            {/* Team Logos and Names */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-1">
              <div className="flex items-center space-x-1 sm:space-x-2 flex-1 justify-end">
                <img 
                  src={getTeamLogo(game.away_team, game.league)} 
                  alt={game.away_team}
                  className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain flex-shrink-0 ${
                    game.is_future ? 'opacity-70' : ''
                  }`}
                />
                <span className={`font-medium text-gray-900 text-sm sm:text-base truncate ${
                  game.is_future ? 'text-gray-600' : ''
                }`}>{formatTeamName(game.away_team, game.league)}</span>
              </div>
              
              <span className="text-gray-500 font-medium text-sm sm:text-base flex-shrink-0">@</span>
              
              <div className="flex items-center space-x-1 sm:space-x-2 flex-1 justify-start">
                <span className={`font-medium text-gray-900 text-sm sm:text-base truncate ${
                  game.is_future ? 'text-gray-600' : ''
                }`}>{formatTeamName(game.home_team, game.league)}</span>
                <img 
                  src={getTeamLogo(game.home_team, game.league)} 
                  alt={game.home_team}
                  className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain flex-shrink-0 ${
                    game.is_future ? 'opacity-70' : ''
                  }`}
                />
              </div>
            </div>
            
            {/* Score/Status container - fixed height */}
            <div className="h-[32px] flex items-center justify-center">
              {score ? (
                <div className="text-2xl font-bold text-field-green">
                  {score}
                </div>
              ) : game.is_future ? (
                <Badge variant="outline" className="border-gray-300 text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Scheduled
                </Badge>
              ) : (
                <div className="text-sm italic text-gray-500">
                  Score unavailable
                </div>
              )}
            </div>
          </div>

          {/* Date and additional info - fixed height container with reduced spacing */}
          <div className="text-center min-h-[50px] flex flex-col justify-start">
            <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDateTime(game.date, game.game_datetime)}
            </div>
            
            {/* Additional info container - fixed height with reduced spacing */}
            <div className="min-h-[15px] flex flex-col justify-start">
              {pitchingResults}
              {probablePitchers}
            </div>
          </div>
        </CardContent>
      </Link>

      {/* Vertical divider with margins */}
      <div className="border-t border-gray-200 mx-4"></div>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          {/* View Boxscore Link with reduced padding - only show for completed games */}
          {game.boxscore_url && !game.is_future && (
            <div className="flex justify-center pt-1">
              <a 
                href={game.boxscore_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-field-green hover:underline font-semibold text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                View Boxscore
              </a>
            </div>
          )}
          
          {/* Add to Diary Button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              onAddToDiary(game.game_id);
            }}
            className="w-full bg-field-green hover:bg-field-dark transition-colors"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAuthenticated ? 'Add to Diary' : 'Sign in to Add'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
