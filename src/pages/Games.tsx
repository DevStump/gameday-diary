
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import GameCard from '@/components/GameCard';
import GameFilters from '@/components/GameFilters';
import { Loader2, Trophy } from 'lucide-react';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    league: '',
    season: '',
    playoff: ''
  });

  const isAuthenticated = false; // TODO: Replace with actual auth state

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockGames = [
        {
          game_id: 'nfl_1',
          date: '2024-01-15',
          home_team: 'Chiefs',
          away_team: 'Bills',
          league: 'NFL' as const,
          pts_off: 31,
          pts_def: 17,
          playoff: true,
          venue: 'Arrowhead Stadium'
        },
        {
          game_id: 'mlb_1',
          date: '2024-10-01',
          home_team: 'Dodgers',
          away_team: 'Padres',
          league: 'MLB' as const,
          runs_scored: 8,
          runs_allowed: 4,
          playoff: true,
          venue: 'Dodger Stadium'
        },
        {
          game_id: 'nfl_2',
          date: '2024-09-08',
          home_team: 'Packers',
          away_team: 'Lions',
          league: 'NFL' as const,
          pts_off: 24,
          pts_def: 21,
          playoff: false,
          venue: 'Lambeau Field'
        }
      ];
      
      setGames(mockGames);
      setLoading(false);
    }, 1000);
  }, []);

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

  const handleAddToDiary = (gameId: string) => {
    if (!isAuthenticated) {
      console.log('Redirect to login with game:', gameId);
      // TODO: Implement auth modal or redirect
      return;
    }
    console.log('Add game to diary:', gameId);
    // TODO: Implement add to diary functionality
  };

  const filteredGames = games.filter(game => {
    if (filters.search && !game.home_team.toLowerCase().includes(filters.search.toLowerCase()) && 
        !game.away_team.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.league && game.league !== filters.league) {
      return false;
    }
    if (filters.playoff && game.playoff.toString() !== filters.playoff) {
      return false;
    }
    return true;
  });

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
          {!isAuthenticated && (
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
                {filteredGames.length} Games Found
              </h2>
            </div>

            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game, index) => (
                  <div key={game.game_id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <GameCard
                      game={game}
                      onAddToDiary={handleAddToDiary}
                      isAuthenticated={isAuthenticated}
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
      </div>
    </Layout>
  );
};

export default Games;
