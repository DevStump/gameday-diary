
import React from 'react';
import Layout from '@/components/Layout';
import { Calendar, MapPin, Star, Users, Heart, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGameLogs } from '@/hooks/useGameLogs';
import { useGames } from '@/hooks/useGames';
import { formatTeamName, getTeamLogo } from '@/utils/teamLogos';
import EditGameLogModal from '@/components/EditGameLogModal';
import DeleteGameLogModal from '@/components/DeleteGameLogModal';

const Timeline = () => {
  const { data: gameLogs, isLoading } = useGameLogs();

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading your game timeline...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Game Timeline</h1>
          <p className="text-lg text-gray-600">
            Your personal journey through the games you've watched and attended
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {gameLogs?.map((log, index) => (
            <GameLogEntry key={log.id} log={log} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {gameLogs?.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No games logged yet</h3>
            <p className="text-gray-600 mb-4">Start building your game diary by adding games you've watched or attended.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

const GameLogEntry = ({ log, index }: { log: any; index: number }) => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  
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

  // Calculate if rooted team won
  const getRootedTeamResult = () => {
    if (!log.rooted_for || log.rooted_for === 'none' || !game?.result) {
      return null;
    }

    const [awayScore, homeScore] = game.result.split('-').map(Number);
    const rootedTeamWon = 
      (log.rooted_for === game.home_team && homeScore > awayScore) ||
      (log.rooted_for === game.away_team && awayScore > homeScore);
    
    return rootedTeamWon ? 'Won' : 'Lost';
  };

  if (!game || !league) {
    return (
      <Card className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline">Loading...</Badge>
            <div className="text-sm text-gray-500">
              Added {formatTime(log.created_at)}
            </div>
          </div>
          <div className="text-gray-500">Loading game details...</div>
        </CardContent>
      </Card>
    );
  }

  const rootedResult = getRootedTeamResult();

  return (
    <>
      <Card className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
            {/* Game Info */}
            <div className="flex-1 mb-4 lg:mb-0">
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

              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-2">
                  <img 
                    src={getTeamLogo(game.away_team, league)} 
                    alt={game.away_team}
                    className="h-8 w-8 object-contain"
                  />
                  <span className="font-medium text-gray-900">{formatTeamName(game.away_team, league)}</span>
                </div>
                
                <span className="text-gray-500 font-medium">@</span>
                
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{formatTeamName(game.home_team, league)}</span>
                  <img 
                    src={getTeamLogo(game.home_team, league)} 
                    alt={game.home_team}
                    className="h-8 w-8 object-contain"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(game.date)}
                </div>
                {game.result && (
                  <div className="text-lg font-bold text-field-green">
                    {game.result}
                  </div>
                )}
              </div>

              {/* Rating */}
              {log.rating && (
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">Rating:</span>
                  <div className="flex">
                    {renderStars(log.rating)}
                  </div>
                </div>
              )}
            </div>

            {/* Log Details */}
            <div className="lg:w-1/3 space-y-3">
              {log.company && (
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{log.company}</span>
                </div>
              )}

              {log.rooted_for && log.rooted_for !== 'none' && (
                <div className="flex items-center space-x-2 text-sm">
                  <Heart className="h-4 w-4 text-red-500" />
                  <div className="flex items-center space-x-2">
                    <img 
                      src={getTeamLogo(log.rooted_for, league)} 
                      alt={log.rooted_for}
                      className="h-4 w-4 object-contain"
                    />
                    <span className="text-gray-700">
                      Rooted for {formatTeamName(log.rooted_for, league)}
                      {rootedResult && (
                        <span className={`ml-2 font-semibold ${
                          rootedResult === 'Won' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({rootedResult})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {log.notes && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700 italic">"{log.notes}"</p>
                </div>
              )}

              <div className="text-xs text-gray-500 border-t pt-2">
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

export default Timeline;
