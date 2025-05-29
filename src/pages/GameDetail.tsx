
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ArrowLeft, Plus, Users, Trophy, Target } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const GameDetail = () => {
  const { gameId, league } = useParams<{ gameId: string; league: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: game, isLoading, error } = useGame(
    gameId || '', 
    (league?.toUpperCase() as 'NFL' | 'MLB') || 'NFL'
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAddToDiary = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // This will be handled by the existing modal system
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
    if (game.league === 'NFL' && game.pts_off !== undefined && game.pts_def !== undefined) {
      return { home: game.pts_def, away: game.pts_off };
    }
    if (game.league === 'MLB' && game.runs_scored !== undefined && game.runs_allowed !== undefined) {
      return { home: game.runs_allowed, away: game.runs_scored };
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
            {game.playoff && (
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
            <CardTitle className="text-3xl font-bold text-gray-900">
              {game.away_team} @ {game.home_team}
            </CardTitle>
            {score && (
              <div className="text-4xl font-bold text-field-green mt-4">
                {score.away} - {score.home}
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
            <div className="flex justify-center">
              <Button
                onClick={handleAddToDiary}
                className="bg-field-green hover:bg-field-dark"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                {user ? 'Add to My Diary' : 'Sign in to Add to Diary'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game Statistics */}
        {game.league === 'NFL' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Offensive Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {game.yards_off && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Yards</span>
                    <span className="font-semibold">{game.yards_off}</span>
                  </div>
                )}
                {game.pass_yds_off && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passing Yards</span>
                    <span className="font-semibold">{game.pass_yds_off}</span>
                  </div>
                )}
                {game.rush_yds_off && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rushing Yards</span>
                    <span className="font-semibold">{game.rush_yds_off}</span>
                  </div>
                )}
                {game.first_down_off && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Downs</span>
                    <span className="font-semibold">{game.first_down_off}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Turnovers</span>
                  <span className="font-semibold">{game.to_off || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Defensive Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {game.yards_def && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yards Allowed</span>
                    <span className="font-semibold">{game.yards_def}</span>
                  </div>
                )}
                {game.pass_yds_def && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pass Yards Allowed</span>
                    <span className="font-semibold">{game.pass_yds_def}</span>
                  </div>
                )}
                {game.rush_yds_def && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rush Yards Allowed</span>
                    <span className="font-semibold">{game.rush_yds_def}</span>
                  </div>
                )}
                {game.first_down_def && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Downs Allowed</span>
                    <span className="font-semibold">{game.first_down_def}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Turnovers Forced</span>
                  <span className="font-semibold">{game.to_def || 0}</span>
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
              {game.innings && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Innings</span>
                  <span className="font-semibold">{game.innings}</span>
                </div>
              )}
              {game.winning_pitcher && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Winning Pitcher</span>
                  <span className="font-semibold">{game.winning_pitcher}</span>
                </div>
              )}
              {game.losing_pitcher && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Losing Pitcher</span>
                  <span className="font-semibold">{game.losing_pitcher}</span>
                </div>
              )}
              {game.saving_pitcher && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Save</span>
                  <span className="font-semibold">{game.saving_pitcher}</span>
                </div>
              )}
              {game.attendance && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendance</span>
                  <span className="font-semibold">{game.attendance.toLocaleString()}</span>
                </div>
              )}
              {game.time_of_game && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Game Time</span>
                  <span className="font-semibold">{Math.floor(game.time_of_game / 60)}:{(game.time_of_game % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
              {game.walkoff && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Walk-off</span>
                  <Badge variant="outline" className="border-sports-gold text-sports-gold">Yes</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {game.season && (
              <div className="flex justify-between">
                <span className="text-gray-600">Season</span>
                <span className="font-semibold">{game.season}</span>
              </div>
            )}
            {game.week && (
              <div className="flex justify-between">
                <span className="text-gray-600">Week</span>
                <span className="font-semibold">{game.week}</span>
              </div>
            )}
            {game.overtime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Overtime</span>
                <span className="font-semibold">{game.overtime}</span>
              </div>
            )}
            {game.result && (
              <div className="flex justify-between">
                <span className="text-gray-600">Result</span>
                <span className="font-semibold">{game.result}</span>
              </div>
            )}
            {game.boxscore_url && (
              <div className="flex justify-between">
                <span className="text-gray-600">Boxscore</span>
                <a 
                  href={game.boxscore_url} 
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
      </div>
    </Layout>
  );
};

export default GameDetail;
