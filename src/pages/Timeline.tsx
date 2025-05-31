
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLoggedGames } from '@/hooks/useLoggedGames';
import { Calendar, MapPin, Trophy, Clock, Star, Trash2, Edit, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { getTeamLogo } from '@/utils/teamLogos';
import EditGameLogModal from '@/components/EditGameLogModal';
import DeleteGameLogModal from '@/components/DeleteGameLogModal';
import { Link } from 'react-router-dom';

const Timeline = () => {
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGameLog, setSelectedGameLog] = useState<any>(null);

  // For unauthenticated users, show sign-in prompt
  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Game Diary</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Keep track of all the games you've watched and attended with personal notes, ratings, and memories.
            </p>
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <Trophy className="h-12 w-12 text-field-green mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In to Start Your Diary</h2>
              <p className="text-gray-600 mb-6">
                Create an account to log games and build your personal sports timeline.
              </p>
              <Button asChild className="bg-field-green hover:bg-field-dark">
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const { data: loggedGames, isLoading } = useLoggedGames({
    enabled: !!user
  });

  const handleEditClick = (gameLog: any) => {
    setSelectedGameLog(gameLog);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (gameLog: any) => {
    setSelectedGameLog(gameLog);
    setDeleteModalOpen(true);
  };

  const generateBoxscoreUrl = (game: any) => {
    const year = new Date(game.date).getFullYear();
    const homeTeamAbbr = game.home_team;
    const date = game.date.replace(/-/g, '');
    const gameNumber = game.doubleheader === 'S' && game.game_num ? game.game_num.toString() : '0';
    return `https://www.baseball-reference.com/boxes/${homeTeamAbbr}/${homeTeamAbbr}${date}${gameNumber}.shtml`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {loggedGames?.length ? `${loggedGames.length} Games in Your Diary` : 'Your Game Diary'}
          </h1>
        </div>

        {/* Games Grid */}
        {!loggedGames?.length ? (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No games logged yet</h2>
            <p className="text-gray-600 mb-6">
              Start by browsing games and adding them to your diary
            </p>
            <Button asChild className="bg-field-green hover:bg-field-dark">
              <Link to="/">Browse Games</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loggedGames.map((game) => (
              <Card key={game.logData.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="bg-field-green text-white">
                      MLB
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(game.logData)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(game.logData)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{game.venue}</span>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-center gap-x-2 mb-4">
                    <div className="flex items-center gap-x-2">
                      <img 
                        src={getTeamLogo(game.away_team, 'MLB')} 
                        alt={game.away_team}
                        className="w-8 h-8"
                      />
                      <span className="text-sm font-medium">{game.away_team}</span>
                    </div>
                    <span className="text-gray-500 font-medium">@</span>
                    <div className="flex items-center gap-x-2">
                      <span className="text-sm font-medium">{game.home_team}</span>
                      <img 
                        src={getTeamLogo(game.home_team, 'MLB')} 
                        alt={game.home_team}
                        className="w-8 h-8"
                      />
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-field-green">
                      {game.away_score} - {game.home_score}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-center text-sm text-gray-600 mb-4">
                    <div>{format(new Date(game.date), 'MMM d, yyyy')}</div>
                    {game.game_datetime && (
                      <div className="text-xs text-gray-500">
                        {format(new Date(game.game_datetime), 'h:mm a')}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Boxscore Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-4 border-field-green text-field-green bg-transparent hover:bg-field-light"
                    asChild
                  >
                    <a 
                      href={generateBoxscoreUrl(game)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Boxscore
                    </a>
                  </Button>

                  {/* Game Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mode:</span>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium capitalize">{game.logData.mode}</span>
                      </div>
                    </div>

                    {game.logData.rating && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= game.logData.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {game.logData.rooted_for && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rooted for:</span>
                        <div className="flex items-center space-x-1">
                          <img 
                            src={getTeamLogo(game.logData.rooted_for, 'MLB')} 
                            alt={game.logData.rooted_for}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium">{game.logData.rooted_for} (W)</span>
                        </div>
                      </div>
                    )}

                    {game.logData.company && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Company:</span>
                        <span className="text-sm">{game.logData.company}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {game.logData.notes && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Notes:</div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {game.logData.notes}
                      </div>
                    </div>
                  )}

                  {/* Added timestamp */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 text-center">
                      Added: {format(new Date(game.logData.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {selectedGameLog && (
          <EditGameLogModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedGameLog(null);
            }}
            gameLog={selectedGameLog}
            game={loggedGames?.find(g => g.logData.id === selectedGameLog.id)}
            league="mlb"
          />
        )}

        {/* Delete Modal */}
        {selectedGameLog && (
          <DeleteGameLogModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedGameLog(null);
            }}
            gameLog={selectedGameLog}
            game={loggedGames?.find(g => g.logData.id === selectedGameLog.id)}
            league="mlb"
          />
        )}
      </div>
    </Layout>
  );
};

export default Timeline;
