
import React from 'react';
import Layout from '@/components/Layout';
import { Calendar, MapPin, Star, Users, Heart, Edit, Trash2, Plus, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGameLogs } from '@/hooks/useGameLogs';
import { useGames } from '@/hooks/useGames';
import { formatTeamName, getTeamLogo } from '@/utils/teamLogos';
import EditGameLogModal from '@/components/EditGameLogModal';
import DeleteGameLogModal from '@/components/DeleteGameLogModal';
import { useNavigate, Link } from 'react-router-dom';
import GameTeamDisplay from '@/components/game-card/GameTeamDisplay';
import GameScore from '@/components/game-card/GameScore';
import GameDateTime from '@/components/game-card/GameDateTime';

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
        return { game: nflGame, league: 'NFL' as const };
      }
    }
    
    if (mlbGames) {
      const mlbGame = mlbGames.find(g => g.game_id === log.game_id);
      if (mlbGame) {
        // Map MLB game data to expected format
        const mappedGame = {
          ...mlbGame,
          league: 'MLB' as const,
          date: mlbGame.date || mlbGame.game_date,
          home_team: mlbGame.home_team || mlbGame.home_name,
          away_team: mlbGame.away_team || mlbGame.away_name,
          runs_scored: mlbGame.runs_scored || mlbGame.home_score,
          runs_allowed: mlbGame.runs_allowed || mlbGame.away_score,
          venue: mlbGame.venue || mlbGame.venue_name || 'Stadium',
          playoff: mlbGame.playoff || ['W', 'D', 'L'].includes(mlbGame.game_type),
          boxscore_url: mlbGame.boxscore_url
        };
        return { game: mappedGame, league: 'MLB' as const };
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

  const generateBoxscoreUrl = () => {
    if (game?.league === 'MLB') {
      // Use the same boxscore URL generation logic as GameCard
      return game.boxscore_url;
    } else {
      return game?.boxscore_url;
    }
  };

  if (!game || !league) {
    return (
      <Card className="animate-slide-up h-full flex flex-col transition-shadow duration-200" style={{ animationDelay: `${index * 0.1}s` }}>
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
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isBeforeToday = new Date(game.date) <= new Date(yesterday.toDateString());

  return (
    <>
      <Card className="transition-shadow duration-200 animate-fade-in h-full flex flex-col" style={{ animationDelay: `${index * 0.1}s` }}>
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Top Section - Badges and Edit/Delete Actions */}
          <div className="flex justify-between items-start mb-3 min-h-[32px]">
            <div className="flex items-center space-x-2 flex-wrap">
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
            <div className="flex items-center space-x-1">
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

          {/* Venue */}
          {game.venue && (
            <div className="flex items-center justify-center text-sm text-gray-600 mb-3 min-h-[20px]">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-center">{game.venue}</span>
            </div>
          )}

          {/* Teams and Score */}
          <div className="text-center mb-3 flex-1 flex flex-col justify-center min-h-[100px]">
            <GameTeamDisplay 
              homeTeam={game.home_team}
              awayTeam={game.away_team}
              league={league}
              gameDate={game.date}
            />
            <GameScore 
              league={league}
              ptsOff={game.pts_off}
              ptsDef={game.pts_def}
              runsScored={game.runs_scored}
              runsAllowed={game.runs_allowed}
            />
          </div>

          {/* Date and Time */}
          <div className="text-center min-h-[50px] flex flex-col justify-start">
            <GameDateTime date={game.date} gameDateTime={game.game_datetime} />
          </div>
        </CardContent>

        {/* Diary Metadata Section */}
        <div className="border-t border-gray-200 mx-4"></div>
        
        <div className="p-4 pt-3 space-y-3">
          {/* Rating */}
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-gray-500" />
            {log.rating ? (
              <div className="flex">
                {renderStars(log.rating)}
              </div>
            ) : (
              <span className="text-gray-400 italic text-sm">Not rated</span>
            )}
          </div>

          {/* Company */}
          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4 text-gray-500" />
            <span className={log.company ? "text-gray-700" : "text-gray-400 italic"}>
              {log.company || "No company specified"}
            </span>
          </div>

          {/* Rooted for */}
          <div className="flex items-center space-x-2 text-sm">
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

          {/* Notes */}
          {log.notes && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700 italic">"{log.notes}"</p>
            </div>
          )}

          {/* Added date */}
          <div className="text-xs text-gray-500 pt-2 border-t">
            Added: {formatDate(log.created_at)} at {formatTime(log.created_at)}
          </div>
        </div>

        {/* Footer with Boxscore Button */}
        <div className="border-t border-gray-200 mx-4"></div>
        
        <CardFooter className="p-4 pt-3">
          <div className="w-full flex justify-end">
            {isBeforeToday && generateBoxscoreUrl() && (
              <a 
                href={generateBoxscoreUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-field-green text-field-green bg-transparent hover:bg-field-light transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Boxscore
                </Button>
              </a>
            )}
          </div>
        </CardFooter>
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
