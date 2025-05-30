import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useGame } from '@/hooks/useGame';
import GameLogModal from '@/components/GameLogModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, MapPin, ArrowLeft, Plus, Trophy, Zap, ExternalLink } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getTeamLogo, formatTeamName } from '@/utils/teamLogos';

const GameDetail = () => {
  const { gameId, league } = useParams<{ gameId: string; league: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showGameLogModal, setShowGameLogModal] = useState(false);
  
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
      // Store current URL before redirecting to auth
      localStorage.setItem('redirectUrl', window.location.pathname);
      navigate('/auth');
      return;
    }
    setShowGameLogModal(true);
  };

  // Generate Baseball Reference boxscore URL for MLB games
  const getBaseballReferenceBoxscoreUrl = (game: any) => {
    if (game.league !== 'MLB' || !game.game_date || !game.home_team) {
      return null;
    }

    // Map team names to Baseball Reference codes
    const teamToBBRefCode: Record<string, string> = {
      'Arizona Diamondbacks': 'ARI',
      'Atlanta Braves': 'ATL',
      'Baltimore Orioles': 'BAL',
      'Boston Red Sox': 'BOS',
      'Chicago Cubs': 'CHN',
      'Chicago White Sox': 'CHA',
      'Cincinnati Reds': 'CIN',
      'Cleveland Guardians': 'CLE',
      'Colorado Rockies': 'COL',
      'Detroit Tigers': 'DET',
      'Houston Astros': 'HOU',
      'Kansas City Royals': 'KCA',
      'Los Angeles Angels': 'LAA',
      'Los Angeles Dodgers': 'LAN',
      'Miami Marlins': 'MIA',
      'Milwaukee Brewers': 'MIL',
      'Minnesota Twins': 'MIN',
      'New York Mets': 'NYN',
      'New York Yankees': 'NYA',
      'Oakland Athletics': 'OAK',
      'Athletics': 'OAK',
      'Philadelphia Phillies': 'PHI',
      'Pittsburgh Pirates': 'PIT',
      'San Diego Padres': 'SDN',
      'San Francisco Giants': 'SFN',
      'Seattle Mariners': 'SEA',
      'St. Louis Cardinals': 'SLN',
      'Tampa Bay Rays': 'TBA',
      'Texas Rangers': 'TEX',
      'Toronto Blue Jays': 'TOR',
      'Washington Nationals': 'WAS'
    };

    const homeTeamCode = teamToBBRefCode[game.home_team];
    if (!homeTeamCode) {
      return null;
    }

    // Extract year from game_date
    const year = game.game_date.split('-')[0];
    
    // Format date as YYYYMMDD
    const gameDate = game.game_date.replace(/-/g, '');
    
    // Add game number (0 for single games, could be 1 for doubleheaders)
    const gameId = gameDate + '0';
    
    return `https://www.baseball-reference.com/boxes/${homeTeamCode}/${year}${gameId}.shtml`;
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
    // Don't show score for future games
    if (game.is_future) {
      return null;
    }
    
    if (game.league === 'NFL') {
      const nflGame = game as any;
      if (nflGame.pts_off !== undefined && nflGame.pts_off !== null && 
          nflGame.pts_def !== undefined && nflGame.pts_def !== null) {
        // Only show score if it's not 0-0 (meaning a real game was played)
        if (nflGame.pts_off === 0 && nflGame.pts_def === 0) {
          return null;
        }
        // Away team score first, then home team score
        return { away: nflGame.pts_def, home: nflGame.pts_off };
      }
    }
    if (game.league === 'MLB') {
      const mlbGame = game as any;
      if (mlbGame.runs_scored !== undefined && mlbGame.runs_scored !== null && 
          mlbGame.runs_allowed !== undefined && mlbGame.runs_allowed !== null) {
        // Only show score if it's not 0-0 (meaning a real game was played)
        if (mlbGame.runs_scored === 0 && mlbGame.runs_allowed === 0) {
          return null;
        }
        // Away team score first, then home team score
        return { away: mlbGame.runs_allowed, home: mlbGame.runs_scored };
      }
    }
    return null;
  };

  const score = getScore();
  const gameTitle = `${formatTeamName(game.away_team, game.league)} @ ${formatTeamName(game.home_team, game.league)}`;
  const boxscoreUrl = game.league === 'MLB' ? getBaseballReferenceBoxscoreUrl(game) : (game as any).boxscore_url;

  return (
    <TooltipProvider>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
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
              {game.is_future && (
                <Badge variant="outline" className="border-gray-400 text-gray-600">
                  Future Game
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
                <div className="flex items-center justify-center gap-2">
                  <div className="text-4xl font-bold text-field-green">
                    {score.away} - {score.home}
                  </div>
                  {game.league === 'MLB' && (game as any).walkoff && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Zap className="h-6 w-6 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Walkoff</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
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
                
                {/* View Boxscore button for completed games */}
                {boxscoreUrl && !game.is_future && (
                  <Button 
                    variant="outline"
                    asChild
                    className="border-field-green text-field-green hover:bg-field-green hover:text-white"
                  >
                    <a 
                      href={boxscoreUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Boxscore
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* NFL Specific Stats */}
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Game Log Modal */}
        {showGameLogModal && game && (
          <GameLogModal
            isOpen={showGameLogModal}
            onClose={() => setShowGameLogModal(false)}
            gameId={game.game_id}
            gameTitle={gameTitle}
            homeTeam={game.home_team}
            awayTeam={game.away_team}
            league={game.league}
          />
        )}
      </Layout>
    </TooltipProvider>
  );
};

export default GameDetail;
