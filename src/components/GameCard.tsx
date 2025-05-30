
import React from 'react';
import { Calendar, MapPin, Plus } from 'lucide-react';
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
    // Don't show score for future games
    if (game.is_future) {
      return null;
    }
    
    if (game.league === 'NFL' && game.pts_off !== undefined && game.pts_def !== undefined) {
      return `${game.pts_def} - ${game.pts_off}`;
    }
    if (game.league === 'MLB' && game.runs_scored !== undefined && game.runs_allowed !== undefined) {
      return `${game.runs_allowed} - ${game.runs_scored}`;
    }
    return null;
  };

  const getStatusTag = () => {
    if (!game.status) return null;
    
    const status = game.status.toLowerCase();
    if (status.includes('spring training') || status.includes('exhibition') || status.includes('playoff')) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          {game.status}
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
      <div className="text-sm text-gray-600 mt-2">
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
      <div className="text-sm text-gray-600 mt-1">
        {results.join(', ')}
      </div>
    );
  };

  const score = getScore();
  const statusTag = getStatusTag();
  const probablePitchers = getProbablePitchers();
  const pitchingResults = getPitchingResults();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-fade-in h-full flex flex-col">
      <Link 
        to={`/game/${game.league.toLowerCase()}/${game.game_id}`}
        className="block flex-1 flex flex-col"
      >
        <CardContent className="p-6 cursor-pointer flex-1 flex flex-col">
          {/* Top badges */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
                {game.league}
              </Badge>
              {game.playoff && (
                <Badge variant="outline" className="border-sports-gold text-sports-gold">
                  Playoff
                </Badge>
              )}
              {statusTag}
            </div>
            {game.venue && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {game.venue}
              </div>
            )}
          </div>

          {/* Teams and Score - flex-1 to fill space */}
          <div className="text-center mb-4 flex-1 flex flex-col justify-center">
            {/* Team Logos and Names */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-3">
              <div className="flex items-center space-x-1 sm:space-x-2 flex-1 justify-end">
                <img 
                  src={getTeamLogo(game.away_team, game.league)} 
                  alt={game.away_team}
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain flex-shrink-0"
                />
                <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{formatTeamName(game.away_team, game.league)}</span>
              </div>
              
              <span className="text-gray-500 font-medium text-sm sm:text-base flex-shrink-0">@</span>
              
              <div className="flex items-center space-x-1 sm:space-x-2 flex-1 justify-start">
                <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{formatTeamName(game.home_team, game.league)}</span>
                <img 
                  src={getTeamLogo(game.home_team, game.league)} 
                  alt={game.home_team}
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain flex-shrink-0"
                />
              </div>
            </div>
            
            {score && (
              <div className="text-2xl font-bold text-field-green">
                {score}
              </div>
            )}
          </div>

          {/* Date and additional info at bottom */}
          <div className="text-center">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDateTime(game.date, game.game_datetime)}
            </div>
            
            {game.is_future && game.status && (
              <div className="text-sm text-gray-600 mt-1">
                {game.status}
              </div>
            )}
            
            {!game.is_future && game.status && (
              <div className="text-sm text-gray-600 mt-1">
                {game.status}
              </div>
            )}
            
            {pitchingResults}
            {probablePitchers}
          </div>
        </CardContent>
      </Link>

      {/* Vertical divider with margins */}
      <div className="border-t border-gray-200 mx-6"></div>

      <CardFooter className="p-6 pt-0">
        <div className="w-full space-y-3">
          {/* View Boxscore Link with padding - only show for completed games */}
          {game.boxscore_url && !game.is_future && (
            <div className="flex justify-center pt-2">
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
