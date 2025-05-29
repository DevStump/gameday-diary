
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
  };
  onAddToDiary: (gameId: string) => void;
  isAuthenticated: boolean;
}

const GameCard = ({ game, onAddToDiary, isAuthenticated }: GameCardProps) => {
  const formatDate = (dateString: string) => {
    console.log('Formatting date:', dateString, 'for game:', game.away_team, '@', game.home_team);
    
    // Handle both date string formats
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return dateString; // Return original string if invalid
    }
    
    console.log('Parsed date object:', date);
    
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    console.log('Formatted date result:', formattedDate);
    return formattedDate;
  };

  const getScore = () => {
    if (game.league === 'NFL' && game.pts_off !== undefined && game.pts_def !== undefined) {
      return `${game.pts_off} - ${game.pts_def}`;
    }
    if (game.league === 'MLB' && game.runs_scored !== undefined && game.runs_allowed !== undefined) {
      return `${game.runs_scored} - ${game.runs_allowed}`;
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
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getTeamLogo(game.away_team)} alt={game.away_team} />
                  <AvatarFallback className="text-xs">{game.away_team}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-900">{formatTeamName(game.away_team)}</span>
              </div>
              
              <span className="text-gray-500 font-medium">@</span>
              
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{formatTeamName(game.home_team)}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getTeamLogo(game.home_team)} alt={game.home_team} />
                  <AvatarFallback className="text-xs">{game.home_team}</AvatarFallback>
                </Avatar>
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
      </CardFooter>
    </Card>
  );
};

export default GameCard;
