import React, { useState } from 'react';
import Layout from '@/components/Layout';
import GameCard from '@/components/GameCard';
import GameFilters from '@/components/GameFilters';
import GameLogModal from '@/components/GameLogModal';
import HotGames from '@/components/HotGames';
import { Loader2, Trophy, X, Info } from 'lucide-react';
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
    endDate: '',
    venue: ''
  });
  const [selectedGame, setSelectedGame] = useState<{ 
    id: string; 
    title: string; 
    homeTeam: string; 
    awayTeam: string; 
    league: string;
    venue?: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const gamesPerPage = 24;

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: games = [], isLoading: loading } = useGames({
    ...filters,
    excludeFutureGames: true
  });
  
  // Only fetch game logs if user is authenticated - fixed to not pass any arguments
  const { data: gameLogs = [] } = useGameLogs();

  // Create a set of logged game IDs for quick lookup (only if user is authenticated)
  const loggedGameIds = user ? new Set(gameLogs.map(log => log.game_id?.toString())) : new Set();

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
      endDate: '',
      venue: ''
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

  const handleAddToDiary = (gameId: string, gameTitle: string, homeTeam: string, awayTeam: string, league: string, venue?: string) => {
    console.log('handleAddToDiary called with:', { gameId, gameTitle, homeTeam, awayTeam, league, venue });
    
    if (!user) {
      // Store current URL with filters for redirect after authentication
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
    
    // Security: Validate game ID format before proceeding
    if (!gameId || typeof gameId !== 'string' || gameId.trim() === '') {
      console.error('Invalid game ID provided');
      return;
    }
    
    setSelectedGame({ id: gameId, title: gameTitle, homeTeam, awayTeam, league, venue });
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
    endDate: todayString,
    venue: '',
    excludeFutureGames: true
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        {showInfoBanner && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                🧠 GamedayDiary currently supports MLB only. We're working on NFL next, with NBA to follow!
              </span>
            </div>
            <button
              onClick={() => setShowInfoBanner(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Trophy className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">Games</h1>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600">
              Search every MLB game in history. Add the ones you've seen — live or on screen — to your diary.
            </p>
            {!user && (
              <p className="text-sm text-sports-gold mt-2 font-medium">
                Sign in to start tracking your game-watching journey
              </p>
            )}
          </div>
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
          games={games}
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
            {displayedGames.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedGames.map((game, index) => (
                    <div key={game.game_id} style={{ animationDelay: `${index * 0.1}s` }}>
                      <GameCard
                        game={game}
                        onAddToDiary={handleAddToDiary}
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
            venue={selectedGame.venue}
          />
        )}
      </div>
    </Layout>
  );
};

export default Games;
