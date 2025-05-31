
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Edit, Trash2, Star, User, Eye } from 'lucide-react';
import { useGameLogs } from '@/hooks/useGameLogs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import GameCard from '@/components/GameCard';
import EditGameLogModal from '@/components/EditGameLogModal';
import DeleteGameLogModal from '@/components/DeleteGameLogModal';

const Timeline = () => {
  const { data: gameLogs, isLoading } = useGameLogs();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGameLog, setSelectedGameLog] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-field-green"></div>
        </div>
      </Layout>
    );
  }

  // Show sign-in prompt when not authenticated
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Sign in to view your game diary</h3>
              <p className="mt-1 text-sm text-gray-500">
                Track your baseball experiences and create your personal game timeline.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-field-green hover:bg-field-dark"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading when user is authenticated but data is still loading
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-field-green"></div>
        </div>
      </Layout>
    );
  }

  // Show empty state when authenticated but no games logged
  if (!gameLogs || gameLogs.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No games logged</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a game to your diary.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-field-green hover:bg-field-dark"
                >
                  Browse Games
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Get unique years for filtering
  const years = Array.from(new Set(
    gameLogs.map(log => new Date(log.created_at).getFullYear())
  )).sort((a, b) => b - a);

  // Filter logs by selected year
  const filteredLogs = selectedYear === 'all' 
    ? gameLogs 
    : gameLogs.filter(log => new Date(log.created_at).getFullYear() === parseInt(selectedYear));

  // Group logs by month
  const groupedLogs = filteredLogs.reduce((groups, log) => {
    const date = new Date(log.created_at);
    const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(log);
    return groups;
  }, {} as Record<string, typeof filteredLogs>);

  const handleEdit = (log: any) => {
    setSelectedGameLog(log);
    setEditModalOpen(true);
  };

  const handleDelete = (log: any) => {
    setSelectedGameLog(log);
    setDeleteModalOpen(true);
  };

  const getModeIcon = (mode: string) => {
    return mode === 'attended' ? <User className="h-4 w-4" /> : <Eye className="h-4 w-4" />;
  };

  const getModeColor = (mode: string) => {
    return mode === 'attended' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  // Create a mock game object for GameCard and modals
  const createGameFromLog = (log: any) => ({
    game_id: log.game_id,
    date: new Date(log.created_at).toISOString().split('T')[0],
    home_team: log.rooted_for || 'Home Team',
    away_team: 'Away Team',
    league: 'MLB' as const,
    venue: 'Stadium'
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Game Timeline</h1>
            
            {/* Year Filter */}
            <div className="mb-6">
              <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Year
              </label>
              <select
                id="year-filter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-field-green focus:border-field-green sm:text-sm rounded-md"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredLogs.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Games Attended</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredLogs.filter(log => log.mode === 'attended').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredLogs.filter(log => log.rating).length > 0
                      ? (filteredLogs.reduce((sum, log) => sum + (log.rating || 0), 0) / 
                         filteredLogs.filter(log => log.rating).length).toFixed(1)
                      : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(groupedLogs)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([monthYear, logs]) => (
                <div key={monthYear}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    {monthYear}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {logs
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((log) => (
                        <div key={log.id} className="relative">
                          <GameCard
                            game={createGameFromLog(log)}
                            onAddToDiary={() => {}}
                            isAuthenticated={true}
                            hideDiaryButton={true}
                          />
                          
                          {/* Overlay with log details */}
                          <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge className={getModeColor(log.mode)}>
                                  {getModeIcon(log.mode)}
                                  <span className="ml-1 capitalize">{log.mode}</span>
                                </Badge>
                                
                                {log.rating && (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                                    <Star className="h-3 w-3 mr-1 fill-current" />
                                    {log.rating}/5
                                  </Badge>
                                )}
                                
                                {log.rooted_for && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                                    Rooted for: {log.rooted_for}
                                  </Badge>
                                )}
                                
                                {log.company && (
                                  <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                                    With: {log.company}
                                  </Badge>
                                )}
                              </div>

                              {log.notes && (
                                <div className="mb-4">
                                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                    {log.notes}
                                  </p>
                                </div>
                              )}

                              <div className="text-xs text-gray-500 mb-4">
                                Added {new Date(log.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(log)}
                                className="text-xs flex-1"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(log)}
                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {selectedGameLog && (
          <>
            <EditGameLogModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              gameLog={selectedGameLog}
              game={createGameFromLog(selectedGameLog)}
              league="MLB"
            />

            <DeleteGameLogModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              gameLog={selectedGameLog}
              game={createGameFromLog(selectedGameLog)}
              league="MLB"
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Timeline;
