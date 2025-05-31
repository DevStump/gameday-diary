
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
import { useGameLogs } from '@/hooks/useGameLogs';
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

  const [editingLog, setEditingLog] = useState<string | null>(null);
  const [deletingLog, setDeletingLog] = useState<string | null>(null);

  const { data: gameLogs = [], isLoading } = useGameLogs();

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

  // Apply filters to game logs
  const filteredLogs = gameLogs.filter(log => {
    // Mode filter
    if (filters.mode === 'attended' && log.mode !== 'attended') return false;
    if (filters.mode === 'watched' && log.mode !== 'watched') return false;

    // League filter
    if (filters.league && log.league !== filters.league) return false;

    // Season filter (extract year from game_id or use a different approach)
    if (filters.season) {
      const logYear = new Date(log.created_at).getFullYear().toString();
      if (logYear !== filters.season) return false;
    }

    // Search filter (search in notes, teams, etc.)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = `${log.notes || ''} ${log.rooted_for || ''}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }

    return true;
  });

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
              {filteredLogs.length} {filteredLogs.length === 1 ? 'game' : 'games'}
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
                    <SelectItem value="">All leagues</SelectItem>
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
                    <SelectItem value="">All seasons</SelectItem>
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
        {filteredLogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLogs.map((log, index) => (
              <div key={log.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <GameCard
                  game={{
                    game_id: log.game_id || '',
                    date: new Date(log.created_at).toISOString().split('T')[0],
                    home_team: '',
                    away_team: '',
                    league: 'MLB',
                    venue: log.venue || undefined,
                  }}
                  onAddToDiary={handleAddToDiary}
                  isAuthenticated={!!user}
                  hideDiaryButton={true}
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
            logId={editingLog}
          />
        )}

        {/* Delete Game Log Modal */}
        {deletingLog && (
          <DeleteGameLogModal
            isOpen={!!deletingLog}
            onClose={() => setDeletingLog(null)}
            logId={deletingLog}
          />
        )}
      </div>
    </Layout>
  );
};

export default Timeline;
