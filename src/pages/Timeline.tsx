
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import GameCard from '@/components/GameCard';
import GameLogModal from '@/components/GameLogModal';
import EditGameLogModal from '@/components/EditGameLogModal';
import DeleteGameLogModal from '@/components/DeleteGameLogModal';
import { Loader2, Calendar, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLoggedGames } from '@/hooks/useLoggedGames';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Timeline = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    mode: 'all',
    startDate: '',
    endDate: '',
    league: '',
    season: '',
    playoff: '',
    search: '',
  });

  const [selectedGame, setSelectedGame] = useState<{ 
    id: string; 
    title: string; 
    homeTeam: string; 
    awayTeam: string; 
    league: string;
    venue?: string;
  } | null>(null);

  const [editingLog, setEditingLog] = useState<any | null>(null);
  const [deletingLog, setDeletingLog] = useState<any | null>(null);

  const { data: loggedGames = [], isLoading } = useLoggedGames({
    mode: filters.mode === 'all' ? '' : filters.mode,
    startDate: filters.startDate,
    endDate: filters.endDate,
    league: filters.league,
    season: filters.season,
    playoff: filters.playoff,
    search: filters.search,
  });

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Game Diary</h1>
            <p className="text-gray-600">Please sign in to view your game diary.</p>
            <Button 
              onClick={() => navigate('/auth')} 
              className="mt-4 bg-field-green hover:bg-field-dark"
            >
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-field-green" />
            <span className="ml-2 text-gray-600">Loading your game diary...</span>
          </div>
        </div>
      </Layout>
    );
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      mode: 'all',
      startDate: '',
      endDate: '',
      league: '',
      season: '',
      playoff: '',
      search: '',
    });
  };

  const handleAddToDiary = (gameId: string, gameTitle: string, homeTeam: string, awayTeam: string, league: string, venue?: string) => {
    if (!user) {
      localStorage.setItem('redirectUrl', location.pathname + location.search);
      navigate('/auth');
      return;
    }
    
    setSelectedGame({ id: gameId, title: gameTitle, homeTeam, awayTeam, league, venue });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'mode' && value !== ''
  ) || filters.mode !== 'all';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-8 w-8 text-field-green" />
            <h1 className="text-3xl font-bold text-gray-900">Game Diary</h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600">
              Your personal collection of games you've watched and attended
            </p>
            <Badge variant="secondary" className="self-start sm:self-center">
              {loggedGames.length} {loggedGames.length === 1 ? 'game' : 'games'}
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">Filters</span>
              </div>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearFilters}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                <Select value={filters.mode} onValueChange={(value) => handleFilterChange('mode', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All modes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All modes</SelectItem>
                    <SelectItem value="attended">Attended only</SelectItem>
                    <SelectItem value="watched">Watched only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">League</label>
                <Select value={filters.league} onValueChange={(value) => handleFilterChange('league', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All leagues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All leagues</SelectItem>
                    <SelectItem value="MLB">MLB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <Select value={filters.season} onValueChange={(value) => handleFilterChange('season', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All seasons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All seasons</SelectItem>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Logs Grid */}
        {loggedGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loggedGames.map((game, index) => (
              <div key={game.logData?.id || game.game_id} style={{ animationDelay: `${index * 0.1}s` }}>
                <GameCard
                  game={{
                    game_id: game.game_id || '',
                    date: game.date || new Date().toISOString().split('T')[0],
                    home_team: game.home_team || '',
                    away_team: game.away_team || '',
                    league: game.league || 'MLB',
                    venue: game.venue || game.venue_name || undefined,
                  }}
                  onAddToDiary={handleAddToDiary}
                  isAuthenticated={!!user}
                  hideDiaryButton={true}
                  onEdit={() => setEditingLog({ log: game.logData, game })}
                  onDelete={() => setDeletingLog({ log: game.logData, game })}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'No games match your filters' : 'No games in your diary yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters ? 
                'Try adjusting your filters to see more games.' : 
                'Start by adding some games you\'ve watched or attended.'
              }
            </p>
            {!hasActiveFilters && (
              <Button 
                onClick={() => navigate('/')} 
                className="bg-field-green hover:bg-field-dark"
              >
                Browse Games
              </Button>
            )}
          </div>
        )}

        {/* Game Log Modal */}
        {selectedGame && (
          <GameLogModal
            isOpen={!!selectedGame}
            onClose={() => setSelectedGame(null)}
            gameId={selectedGame.id}
            gameTitle={selectedGame.title}
            homeTeam={selectedGame.homeTeam}
            awayTeam={selectedGame.awayTeam}
            league={selectedGame.league}
            venue={selectedGame.venue}
          />
        )}

        {/* Edit Game Log Modal */}
        {editingLog && (
          <EditGameLogModal
            isOpen={!!editingLog}
            onClose={() => setEditingLog(null)}
            gameLog={editingLog.log}
            game={editingLog.game}
            league="MLB"
          />
        )}

        {/* Delete Game Log Modal */}
        {deletingLog && (
          <DeleteGameLogModal
            isOpen={!!deletingLog}
            onClose={() => setDeletingLog(null)}
            gameLog={deletingLog.log}
            game={deletingLog.game}
            league="MLB"
          />
        )}
      </div>
    </Layout>
  );
};

export default Timeline;
