
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import GameCard from '@/components/GameCard';
import GameFilters from '@/components/GameFilters';
import GameLogModal from '@/components/GameLogModal';
import { Loader2, Trophy } from 'lucide-react';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/contexts/AuthContext';

const Games = () => {
  const [filters, setFilters] = useState({
    search: '',
    league: '',
    season: '',
    playoff: ''
  });
  const [selectedGame, setSelectedGame] = useState<{ id: string; title: string } | null>(null);

  const { user } = useAuth();
  const { data: games = [], isLoading: loading } = useGames(filters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      league: '',
      season: '',
      playoff: ''
    });
  };

  const handleAddToDiary = (gameId: string, gameTitle: string) => {
    if (!user) {
      // Redirect to auth page
      window.location.href = '/auth';
      return;
    }
    setSelectedGame({ id: gameId, title: gameTitle });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Trophy className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">Game Search</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore thousands of NFL and MLB games. Find the perfect match to add to your personal game diary.
          </p>
          {!user && (
            <p className="text-sm text-sports-gold mt-2 font-medium">
              Sign in to start tracking your game-watching journey
            </p>
          )}
        </div>

        {/* Filters */}
        <GameFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-field-green" />
            <span className="ml-2 text-gray-600">Loading games...</span>
          </div>
        )}

        {/* Games Grid */}
        {!loading && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {games.length} Games Found
              </h2>
            </div>

            {games.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game, index) => (
                  <div key={game.game_id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <GameCard
                      game={game}
                      onAddToDiary={(gameId) => handleAddToDiary(gameId, `${game.away_team} @ ${game.home_team}`)}
                      isAuthenticated={!!user}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No games found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more games.</p>
              </div>
            )}
          </>
        )}

        {/* Game Log Modal */}
        {selectedGame && (
          <GameLogModal
            isOpen={!!selectedGame}
            onClose={() => setSelectedGame(null)}
            gameId={selectedGame.id}
            gameTitle={selectedGame.title}
          />
        )}
      </div>
    </Layout>
  );
};

export default Games;
