
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
  };
  onAddToDiary: (gameId: string) => void;
  isAuthenticated: boolean;
}

const GameCard = ({ game, onAddToDiary, isAuthenticated }: GameCardProps) => {
  const formatDate = (dateString: string) => {
    // Just use the date string directly from database
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[parseInt(month) - 1];
      
      const formattedDate = `${monthName} ${parseInt(day)}, ${year}`;
      return formattedDate;
    }
    
    return dateString;
  };

  const getScore = () => {
    if (game.league === 'NFL' && game.pts_off !== undefined && game.pts_def !== undefined) {
      // Fixed: Show home team score on the right (pts_def - pts_off instead of pts_off - pts_def)
      return `${game.pts_def} - ${game.pts_off}`;
    }
    if (game.league === 'MLB' && game.runs_scored !== undefined && game.runs_allowed !== undefined) {
      // Keep MLB scores as they are (away team score first, then home team score)
      return `${game.runs_allowed} - ${game.runs_scored}`;
    }
    return null;
  };

  const score = getScore();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <Link 
        to={`/game/${game.league.toLowerCase()}/${game.game_id}`}
        className="block"
      >
        <CardContent className="p-6 cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
                {game.league}
              </Badge>
              {game.playoff && (
                <Badge variant="outline" className="border-sports-gold text-sports-gold">
                  Playoff
                </Badge>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(game.date)}
              </div>
              {game.venue && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {game.venue}
                </div>
              )}
            </div>
          </div>

          <div className="text-center mb-4">
            {/* Team Logos and Names */}
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="flex items-center space-x-2">
                <img 
                  src={getTeamLogo(game.away_team, game.league)} 
                  alt={game.away_team}
                  className="h-12 w-12 object-contain"
                />
                <span className="font-medium text-gray-900">{formatTeamName(game.away_team, game.league)}</span>
              </div>
              
              <span className="text-gray-500 font-medium">@</span>
              
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{formatTeamName(game.home_team, game.league)}</span>
                <img 
                  src={getTeamLogo(game.home_team, game.league)} 
                  alt={game.home_team}
                  className="h-12 w-12 object-contain"
                />
              </div>
            </div>
            
            {score && (
              <div className="text-2xl font-bold text-field-green">
                {score}
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-6 pt-0">
        <div className="w-full space-y-3">
          {/* View Boxscore Link */}
          {game.boxscore_url && (
            <div className="flex justify-center">
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
