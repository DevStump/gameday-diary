
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MapPin, ArrowLeft, Plus, Users, Trophy, Target } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getTeamLogo, formatTeamName } from '@/utils/teamLogos';

const GameDetail = () => {
  const { gameId, league } = useParams<{ gameId: string; league: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: game, isLoading, error } = useGame(
    gameId || '', 
    (league?.toUpperCase() as 'NFL' | 'MLB') || 'NFL'
  );

  const formatDate = (dateString: string) => {
    // Just use the date string directly from database
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = monthNames[parseInt(month) - 1];
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const tempDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const dayName = dayNames[tempDate.getDay()];
      
      const formattedDate = `${dayName}, ${monthName} ${parseInt(day)}, ${year}`;
      return formattedDate;
    }
    
    return dateString;
  };

  const handleAddToDiary = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    console.log('Add to diary clicked for game:', gameId);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-field-green" />
            <span className="ml-2 text-gray-600">Loading game details...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !game) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Game not found</h3>
            <p className="text-gray-600 mb-4">The game you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')} className="bg-field-green hover:bg-field-dark">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getScore = () => {
    if (game.league === 'NFL') {
      const nflGame = game as any;
      if (nflGame.pts_off !== undefined && nflGame.pts_def !== undefined) {
        // Away team score first, then home team score
        return { away: nflGame.pts_def, home: nflGame.pts_off };
      }
    }
    if (game.league === 'MLB') {
      const mlbGame = game as any;
      if (mlbGame.runs_scored !== undefined && mlbGame.runs_allowed !== undefined) {
        // Away team score first, then home team score
        return { away: mlbGame.runs_allowed, home: mlbGame.runs_scored };
      }
    }
    return null;
  };

  const score = getScore();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
          
          <div className="flex items-center space-x-3 mb-2">
            <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
              {game.league}
            </Badge>
            {(game as any).playoff && (
              <Badge variant="outline" className="border-sports-gold text-sports-gold">
                Playoff Game
              </Badge>
            )}
          </div>
        </div>

        {/* Main Game Info */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="text-lg text-gray-600">{formatDate(game.date)}</span>
            </div>
            
            {/* Team Logos and Names */}
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={getTeamLogo(game.away_team, game.league)} 
                  alt={game.away_team}
                  className="h-20 w-20 object-contain"
                />
                <span className="text-xl font-bold text-gray-900">{formatTeamName(game.away_team, game.league)}</span>
              </div>
              
              <span className="text-gray-500 font-medium text-lg">@</span>
              
              <div className="flex items-center space-x-3">
                <span className="text-xl font-bold text-gray-900">{formatTeamName(game.home_team, game.league)}</span>
                <img 
                  src={getTeamLogo(game.home_team, game.league)} 
                  alt={game.home_team}
                  className="h-20 w-20 object-contain"
                />
              </div>
            </div>

            {score && (
              <div className="text-4xl font-bold text-field-green mt-4">
                {score.away} - {score.home}
              </div>
            )}

            {/* Week for NFL games */}
            {game.league === 'NFL' && (game as any).week && (
              <div className="text-lg text-gray-700 font-medium mt-2">
                Week {(game as any).week}
              </div>
            )}

            {game.venue && (
              <div className="flex items-center justify-center space-x-1 text-gray-600 mt-2">
                <MapPin className="h-4 w-4" />
                <span>{game.venue}</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-3">
              <Button
                onClick={handleAddToDiary}
                className="bg-field-green hover:bg-field-dark"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                {user ? 'Add to My Diary' : 'Sign in to Add to Diary'}
              </Button>
              
              {/* View Boxscore for NFL games */}
              {game.league === 'NFL' && (game as any).boxscore_url && (
                <a 
                  href={(game as any).boxscore_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-field-green hover:underline font-semibold"
                >
                  View Boxscore
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Statistics */}
        {game.league === 'NFL' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <img 
                    src={getTeamLogo(game.away_team, game.league)} 
                    alt={game.away_team}
                    className="h-6 w-6 object-contain"
                  />
                  <span>{formatTeamName(game.away_team, game.league)} Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(game as any).yards_def && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Yards</span>
                    <span className="font-semibold">{(game as any).yards_def}</span>
                  </div>
                )}
                {(game as any).pass_yds_def && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passing Yards</span>
                    <span className="font-semibold">{(game as any).pass_yds_def}</span>
                  </div>
                )}
                {(game as any).rush_yds_def && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rushing Yards</span>
                    <span className="font-semibold">{(game as any).rush_yds_def}</span>
                  </div>
                )}
                {(game as any).first_down_def && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Downs</span>
                    <span className="font-semibold">{(game as any).first_down_def}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Turnovers</span>
                  <span className="font-semibold">{(game as any).to_def || 0}</span>
                </div>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <img 
                    src={getTeamLogo(game.home_team, game.league)} 
                    alt={game.home_team}
                    className="h-6 w-6 object-contain"
                  />
                  <span>{formatTeamName(game.home_team, game.league)} Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(game as any).yards_off && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Yards</span>
                    <span className="font-semibold">{(game as any).yards_off}</span>
                  </div>
                )}
                {(game as any).pass_yds_off && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passing Yards</span>
                    <span className="font-semibold">{(game as any).pass_yds_off}</span>
                  </div>
                )}
                {(game as any).rush_yds_off && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rushing Yards</span>
                    <span className="font-semibold">{(game as any).rush_yds_off}</span>
                  </div>
                )}
                {(game as any).first_down_off && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Downs</span>
                    <span className="font-semibold">{(game as any).first_down_off}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Turnovers</span>
                  <span className="font-semibold">{(game as any).to_off || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* MLB Specific Stats */}
        {game.league === 'MLB' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Game Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(game as any).innings != null && (game as any).innings > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Innings</span>
                  <span className="font-semibold">{(game as any).innings}</span>
                </div>
              )}
              {(game as any).winning_pitcher && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Winning Pitcher</span>
                  <span className="font-semibold">{(game as any).winning_pitcher}</span>
                </div>
              )}
              {(game as any).losing_pitcher && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Losing Pitcher</span>
                  <span className="font-semibold">{(game as any).losing_pitcher}</span>
                </div>
              )}
              {(game as any).saving_pitcher && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Save</span>
                  <span className="font-semibold">{(game as any).saving_pitcher}</span>
                </div>
              )}
              {(game as any).attendance && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendance</span>
                  <span className="font-semibold">{(game as any).attendance.toLocaleString()}</span>
                </div>
              )}
              {(game as any).time_of_game && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Game Time</span>
                  <span className="font-semibold">{Math.floor((game as any).time_of_game / 60)}:{((game as any).time_of_game % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
              {(game as any).walkoff && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Walk-off</span>
                  <Badge variant="outline" className="border-sports-gold text-sports-gold">Yes</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Info - Only for MLB games */}
        {game.league === 'MLB' && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(game as any).season && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Season</span>
                  <span className="font-semibold">{(game as any).season}</span>
                </div>
              )}
              {(game as any).overtime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime</span>
                  <span className="font-semibold">{(game as any).overtime}</span>
                </div>
              )}
              {(game as any).boxscore_url && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Boxscore</span>
                  <a 
                    href={(game as any).boxscore_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-field-green hover:underline font-semibold"
                  >
                    View Boxscore
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default GameDetail;
