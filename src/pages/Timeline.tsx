
import React from 'react';
import Layout from '@/components/Layout';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameLogs } from '@/hooks/useGameLogs';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import GameCard from '@/components/GameCard';

const Timeline = () => {
  const { user } = useAuth();
  const { data: gameLogs, isLoading: logsLoading } = useGameLogs();

  // Get all games that have been logged by the user
  const loggedGameIds = gameLogs?.map(log => log.game_id) || [];

  // Fetch all games to filter the logged ones
  const { data: allGames = [], isLoading: gamesLoading } = useGames({
    search: '',
    league: '',
    season: '',
    playoff: '',
    startDate: '',
    endDate: ''
  });

  const isLoading = logsLoading || gamesLoading;

  // Filter games to only include those that have been logged
  const loggedGames = allGames.filter(game => 
    loggedGameIds.includes(game.game_id)
  );

  // Sort by most recently logged (based on game log creation date)
  const sortedLoggedGames = loggedGames.sort((a, b) => {
    const logA = gameLogs?.find(log => log.game_id === a.game_id);
    const logB = gameLogs?.find(log => log.game_id === b.game_id);
    
    if (!logA || !logB) return 0;
    
    return new Date(logB.created_at).getTime() - new Date(logA.created_at).getTime();
  });

  const handleAddToDiary = (gameId: string) => {
    // This won't be used since these games are already in the diary
    console.log('Game already in diary:', gameId);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-field-green" />
            <span className="ml-2 text-gray-600">Loading your diary...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
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

        {/* Games Count */}
        {sortedLoggedGames.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {sortedLoggedGames.length} Games in Your Diary
            </h2>
          </div>
        )}

        {/* Games Grid - Using exact same GameCard components */}
        {sortedLoggedGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLoggedGames.map((game, index) => (
              <div key={game.game_id} style={{ animationDelay: `${index * 0.1}s` }}>
                <GameCard
                  game={game}
                  onAddToDiary={handleAddToDiary}
                  isAuthenticated={!!user}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No games logged yet</h3>
            <p className="text-gray-600 mb-6">Start building your game diary by adding games you've watched or attended.</p>
            <Link to="/">
              <Button className="bg-field-green hover:bg-field-dark">
                Browse Games
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Timeline;
