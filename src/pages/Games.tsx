import React, { useState } from 'react';
import Layout from '@/components/Layout';
import GameCard from '@/components/GameCard';
import GameFilters from '@/components/GameFilters';
import GameLogModal from '@/components/GameLogModal';
import HotGames from '@/components/HotGames';
import { Loader2, Trophy } from 'lucide-react';
import { useGames } from '@/hooks/useGames';
import { useGameLogs } from '@/hooks/useGameLogs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Games = () => {
  const [filters, setFilters] = useState({
    search: '',
    league: '',
    season: '',
    playoff: '',
    startDate: '',
    endDate: ''
  });
  const [selectedGame, setSelectedGame] = useState<{ 
    id: string; 
    title: string; 
    homeTeam: string; 
    awayTeam: string; 
    league: string; 
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 24;

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: games = [], isLoading: loading } = useGames(filters);
  const { data: gameLogs = [] } = useGameLogs();

  // Create a set of logged game IDs for quick lookup
  const loggedGameIds = new Set(gameLogs.map(log => log.game_id?.toString()));

  // Calculate pagination
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const displayedGames = games.slice(startIndex, endIndex);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      league: '',
      season: '',
      playoff: '',
      startDate: '',
      endDate: ''
    });
    // Reset to first page when filters are cleared
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    }
  };

  const handleAddToDiary = (gameId: string, gameTitle: string, homeTeam: string, awayTeam: string, league: string) => {
    if (!user) {
      // Store current URL with filters
      const currentUrl = window.location.origin + location.pathname + location.search;
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          const url = new URL(currentUrl);
          url.searchParams.set(key, value);
        }
      });
      localStorage.setItem('redirectUrl', location.pathname + location.search);
      navigate('/auth');
      return;
    }
    setSelectedGame({ id: gameId, title: gameTitle, homeTeam, awayTeam, league });
  };

  // Get games from past 3 days for hot games section (excluding future games)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const threeDaysAgoString = threeDaysAgo.toISOString().split('T')[0];
  
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const { data: hotGamesData = [] } = useGames({
    search: '',
    league: '',
    season: '',
    playoff: '',
    startDate: threeDaysAgoString,
    endDate: todayString
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Trophy className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">Games</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Relive your favorite moments. Search for any NFL or MLB game you've seen — live or on screen — and add it to your diary.
          </p>
          {!user && (
            <p className="text-sm text-sports-gold mt-2 font-medium">
              Sign in to start tracking your game-watching journey
            </p>
          )}
        </div>

        {/* Hot Games Section */}
        <HotGames 
          games={hotGamesData.filter(game => !game.is_future)} 
          onAddToDiary={handleAddToDiary}
          isAuthenticated={!!user}
        />

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
                {displayedGames.length} Games Displayed 
                {games.length > gamesPerPage && ` (Page ${currentPage} of ${totalPages})`}
                {games.length > 50 && ` - ${games.length} total found`}
              </h2>
            </div>

            {displayedGames.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedGames.map((game, index) => (
                    <div key={game.game_id} style={{ animationDelay: `${index * 0.1}s` }}>
                      <GameCard
                        game={game}
                        onAddToDiary={(gameId) => handleAddToDiary(
                          gameId, 
                          `${game.away_team} @ ${game.home_team}`,
                          game.home_team,
                          game.away_team,
                          game.league
                        )}
                        isAuthenticated={!!user}
                        isAlreadyLogged={loggedGameIds.has(game.game_id?.toString())}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={handlePreviousPage}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext 
                            onClick={handleNextPage}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
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
            homeTeam={selectedGame.homeTeam}
            awayTeam={selectedGame.awayTeam}
            league={selectedGame.league}
          />
        )}
      </div>
    </Layout>
  );
};

export default Games;
