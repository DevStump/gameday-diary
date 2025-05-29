
import React from 'react';
import Layout from '@/components/Layout';
import { Calendar, MapPin, Star, Users, Heart, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGameLogs } from '@/hooks/useGameLogs';
import { useGames } from '@/hooks/useGames';
import { formatTeamName, getTeamLogo } from '@/utils/teamLogos';
import EditGameLogModal from '@/components/EditGameLogModal';
import DeleteGameLogModal from '@/components/DeleteGameLogModal';
import { useNavigate, Link } from 'react-router-dom';

const Diary = () => {
  const { data: gameLogs, isLoading } = useGameLogs();

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading your diary...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Calendar className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">My Diary</h1>
          </div>
          <p className="text-lg text-gray-600">
            Your personal journey through the games you've watched and attended
          </p>
        </div>

        {/* Diary - 2 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {gameLogs?.map((log, index) => (
            <GameLogEntry key={log.id} log={log} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {gameLogs?.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No games logged yet</h3>
            <p className="text-gray-600 mb-6">Start building your game diary by adding games you've watched or attended.</p>
            <Link to="/">
              <Button className="bg-field-green hover:bg-field-dark">
                <Plus className="h-4 w-4 mr-2" />
                Browse Games
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

const GameLogEntry = ({ log, index }: { log: any; index: number }) => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const navigate = useNavigate();
  
  // Fetch both NFL and MLB games to determine which league the game belongs to
  const { data: nflGames } = useGames({
    search: '',
    league: 'NFL',
    season: '',
    playoff: '',
    startDate: '',
    endDate: ''
  });
  
  const { data: mlbGames } = useGames({
    search: '',
    league: 'MLB',
    season: '',
    playoff: '',
    startDate: '',
    endDate: ''
  });

  // Find the game in either NFL or MLB games and determine league
  const findGameAndLeague = () => {
    if (nflGames) {
      const nflGame = nflGames.find(g => g.game_id === log.game_id);
      if (nflGame) {
        return { game: { ...nflGame, league: 'NFL' }, league: 'NFL' as const };
      }
    }
    
    if (mlbGames) {
      const mlbGame = mlbGames.find(g => g.game_id === log.game_id);
      if (mlbGame) {
        return { game: { ...mlbGame, league: 'MLB' }, league: 'MLB' as const };
      }
    }
    
    return { game: null, league: null };
  };

  const { game, league } = findGameAndLeague();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatGameDate = (dateString: string) => {
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-sports-gold fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Calculate if rooted team won and get the score
  const getRootedTeamResult = () => {
    // Return null if no rooted team is selected (null, undefined, or 'none')
    if (!log.rooted_for || log.rooted_for === 'none' || !game) return null;
  
    let teamScore, oppScore;
  
    if (league === 'NFL' && game.pts_off !== undefined && game.pts_def !== undefined) {
      const isHome = log.rooted_for === game.home_team;
      // Fixed: pts_off is home team score, pts_def is away team score
      teamScore = isHome ? game.pts_off : game.pts_def;
      oppScore = isHome ? game.pts_def : game.pts_off;
    } else if (league === 'MLB' && game.runs_scored !== undefined && game.runs_allowed !== undefined) {
      const isHome = log.rooted_for === game.home_team;
      teamScore = isHome ? game.runs_scored : game.runs_allowed;
      oppScore = isHome ? game.runs_allowed : game.runs_scored;
    }
  
    if (teamScore === undefined || oppScore === undefined) return null;
  
    return {
      result: teamScore > oppScore ? 'Won' : 'Lost',
      score: `${teamScore} - ${oppScore}`
    };
  };

  // Get the game score regardless of rooting preference (away - home format)
  const getGameScore = () => {
    if (!game) return null;

    let awayScore, homeScore;

    if (league === 'NFL' && game.pts_off !== undefined && game.pts_def !== undefined) {
      // For NFL: pts_def is away team score, pts_off is home team score
      awayScore = game.pts_def;
      homeScore = game.pts_off;
    } else if (league === 'MLB' && game.runs_scored !== undefined && game.runs_allowed !== undefined) {
      // For MLB: runs_scored is home team score, runs_allowed is away team score
      awayScore = game.runs_allowed;
      homeScore = game.runs_scored;
    }

    if (awayScore === undefined || homeScore === undefined) return null;

    return `${awayScore} - ${homeScore}`;
  };

  const handleViewBoxscore = () => {
    navigate(`/games/${game.game_id}?league=${league}`);
  };

  if (!game || !league) {
    return (
      <Card className="animate-slide-up h-full flex flex-col" style={{ animationDelay: `${index * 0.1}s` }}>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline">Loading...</Badge>
            <div className="text-sm text-gray-500">
              {formatTime(log.created_at)}
            </div>
          </div>
          <div className="text-gray-500 flex-1 flex items-center justify-center">Loading game details...</div>
        </CardContent>
      </Card>
    );
  }

  const rootedResult = getRootedTeamResult();
  const gameScore = getGameScore();

  return (
    <>
      <Card className="animate-slide-up h-full flex flex-col" style={{ animationDelay: `${index * 0.1}s` }}>
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Top Row - Badges and Action Buttons */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Badge variant={league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
                {league}
              </Badge>
              {game.playoff && (
                <Badge variant="outline" className="border-sports-gold text-sports-gold">
                  Playoff
                </Badge>
              )}
              <Badge variant={log.mode === 'attended' ? 'default' : 'secondary'}>
                {log.mode === 'attended' ? 'Attended' : 'Watched'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(true)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Game Date */}
          <div className="flex items-center justify-center text-sm text-gray-600 mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            {formatGameDate(game.date)}
          </div>

          {/* Teams and Score */}
          <div className="text-center mb-3">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="flex items-center space-x-2">
                <img 
                  src={getTeamLogo(game.away_team, league)} 
                  alt={game.away_team}
                  className="h-8 w-8 object-contain"
                />
                <span className="font-medium text-gray-900 text-sm">{formatTeamName(game.away_team, league)}</span>
              </div>
              
              <span className="text-gray-500 font-medium">@</span>
              
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 text-sm">{formatTeamName(game.home_team, league)}</span>
                <img 
                  src={getTeamLogo(game.home_team, league)} 
                  alt={game.home_team}
                  className="h-8 w-8 object-contain"
                />
              </div>
            </div>

            {gameScore && (
              <div className="text-xl font-bold text-gray-900 mb-2">
                {gameScore}
              </div>
            )}
            
            {/* View Boxscore Link - same as GameDetail */}
            {(game as any).boxscore_url && (
              <a 
                href={(game as any).boxscore_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-field-green hover:underline font-semibold text-sm"
              >
                View Boxscore
              </a>
            )}
          </div>

          {/* Log Details - flex-1 to fill remaining space */}
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex-1">
              {/* Company - always show */}
              <div className="flex items-center space-x-2 text-sm mb-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className={log.company ? "text-gray-700" : "text-gray-400 italic"}>
                  {log.company || "No company specified"}
                </span>
              </div>

              {/* Rooted for - always show */}
              <div className="flex items-center space-x-2 text-sm mb-2">
                {log.rooted_for && log.rooted_for !== 'none' ? (
                  <>
                    <img 
                      src={getTeamLogo(log.rooted_for, league)} 
                      alt={log.rooted_for}
                      className="h-4 w-4 object-contain"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">
                        Rooted for {formatTeamName(log.rooted_for, league)}
                        {rootedResult && (
                          <span className="ml-2 font-semibold text-gray-600">
                            ({rootedResult.result})
                          </span>
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-400 italic">No rooting selected</span>
                  </>
                )}
              </div>

              {/* Rating - always show */}
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4 text-gray-500" />
                {log.rating ? (
                  <div className="flex">
                    {renderStars(log.rating)}
                  </div>
                ) : (
                  <div className="flex">
                    {renderStars(0)}
                    <span className="text-gray-400 italic text-sm ml-2">Not rated</span>
                  </div>
                )}
              </div>

              {log.notes && (
                <div className="bg-gray-50 p-3 rounded-md mb-2">
                  <p className="text-sm text-gray-700 italic">"{log.notes}"</p>
                </div>
              )}
            </div>

            {/* Added date at very bottom */}
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-500 text-center">
                Added: {formatDate(log.created_at)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {showEditModal && (
        <EditGameLogModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          gameLog={log}
          game={game}
          league={league}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteGameLogModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          gameLog={log}
          game={game}
          league={league}
        />
      )}
    </>
  );
};

export default Diary;
