
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLoggedGames } from '@/hooks/useLoggedGames';
import { Calendar, MapPin, Trophy, Clock, Star, Trash2, Edit } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="h-8 w-8 text-field-green" />
            <h1 className="text-3xl font-bold text-gray-900">Your Game Diary</h1>
          </div>
          <p className="text-gray-600">
            {loggedGames?.length ? 
              `You've logged ${loggedGames.length} game${loggedGames.length !== 1 ? 's' : ''}` : 
              'Start logging games to build your timeline'
            }
          </p>
        </div>

        {/* Timeline */}
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
          <div className="space-y-6">
            {loggedGames.map((game, index) => (
              <Card key={game.logData.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={getTeamLogo(game.away_team, 'MLB')} 
                          alt={game.away_team}
                          className="w-8 h-8"
                        />
                        <div className="text-center">
                          <div className="text-lg font-semibold">{game.away_score}</div>
                          <div className="text-sm text-gray-600">{game.away_team}</div>
                        </div>
                      </div>
                      
                      <div className="text-gray-400 font-semibold">@</div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{game.home_score}</div>
                          <div className="text-sm text-gray-600">{game.home_team}</div>
                        </div>
                        <img 
                          src={getTeamLogo(game.home_team, 'MLB')} 
                          alt={game.home_team}
                          className="w-8 h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={game.logData.mode === 'attended' ? 'default' : 'secondary'}>
                        {game.logData.mode === 'attended' ? 'Attended' : 'Watched'}
                      </Badge>
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
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(game.date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{game.venue}</span>
                    </div>
                    
                    {game.logData.rating && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{game.logData.rating}/5</span>
                      </div>
                    )}
                    
                    {game.logData.rooted_for && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Trophy className="h-4 w-4 text-field-green" />
                        <span>Rooted for {game.logData.rooted_for}</span>
                      </div>
                    )}
                  </div>
                  
                  {game.logData.company && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">With: </span>
                      <span className="text-sm text-gray-600">{game.logData.company}</span>
                    </div>
                  )}
                  
                  {game.logData.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">Notes:</div>
                      <div className="text-sm text-gray-600">{game.logData.notes}</div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Logged {format(new Date(game.logData.created_at), 'MMM d, yyyy')}</span>
                      {game.logData.updated_at !== game.logData.created_at && (
                        <span>Updated {format(new Date(game.logData.updated_at), 'MMM d, yyyy')}</span>
                      )}
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
