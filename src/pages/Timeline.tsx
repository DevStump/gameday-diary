
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Calendar, Loader2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useGameLogs } from '@/hooks/useGameLogs';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import GameCard from '@/components/GameCard';
import EditGameLogModal from '@/components/EditGameLogModal';
import DeleteGameLogModal from '@/components/DeleteGameLogModal';
import GameFilters from '@/components/GameFilters';
import { getTeamLogo, getTeamAbbreviation } from '@/utils/teamLogos';

const Timeline = () => {
  const { user } = useAuth();
  const { data: gameLogs, isLoading: logsLoading } = useGameLogs();
  const [editingLog, setEditingLog] = useState<any>(null);
  const [deletingLog, setDeletingLog] = useState<any>(null);

  // Filter state - same as Games page plus mode
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    league: '',
    season: '',
    playoff: '',
    search: '',
    mode: '', // New filter for diary entries
  });

  // Fetch MLB games only since we're focusing on MLB data
  const { data: mlbGames = [], isLoading: gamesLoading } = useGames({
    search: filters.search,
    league: 'MLB',
    season: filters.season,
    playoff: filters.playoff,
    startDate: filters.startDate,
    endDate: filters.endDate
  });

  const isLoading = logsLoading || gamesLoading;

  // Create enriched games with log data - focus on MLB
  const enrichedLoggedGames = React.useMemo(() => {
    if (!gameLogs || !mlbGames) return [];

    console.log('Game logs:', gameLogs);
    console.log('MLB games:', mlbGames);

    return gameLogs.map(log => {
      console.log('Looking for game with ID:', log.game_id);
      
      // Find the corresponding MLB game - convert both to string for comparison
      const game = mlbGames.find(g => {
        const gameId = g.game_id?.toString();
        const logGameId = log.game_id?.toString();
        console.log('Comparing:', gameId, 'with', logGameId);
        return gameId === logGameId;
      });
      
      if (!game) {
        console.log('No game found for log:', log);
        return null;
      }

      console.log('Found game:', game);

      // Return enriched game object with log data
      return {
        ...game,
        // Ensure proper field mapping for MLB games
        game_id: game.game_id?.toString() || log.game_id,
        date: game.game_date,
        home_team: game.home_name,
        away_team: game.away_name,
        runs_scored: game.home_score,
        runs_allowed: game.away_score,
        venue: game.venue_name,
        league: 'MLB' as const,
        playoff: ['W', 'D', 'L'].includes(game.game_type),
        // Add log metadata
        logData: {
          id: log.id,
          mode: log.mode,
          company: log.company,
          rating: log.rating,
          rooted_for: log.rooted_for,
          notes: log.notes,
          created_at: log.created_at,
          updated_at: log.updated_at
        }
      };
    }).filter(Boolean);
  }, [gameLogs, mlbGames]);

  // Apply filters to enriched games
  const filteredLoggedGames = React.useMemo(() => {
    let filtered = enrichedLoggedGames;

    // Apply mode filter
    if (filters.mode) {
      filtered = filtered.filter(game => game.logData.mode === filters.mode);
    }

    return filtered;
  }, [enrichedLoggedGames, filters.mode]);

  // Sort by most recently logged (based on game log creation date)
  const sortedLoggedGames = filteredLoggedGames.sort((a, b) => {
    return new Date(b.logData.created_at).getTime() - new Date(a.logData.created_at).getTime();
  });

  const handleAddToDiary = (gameId: string) => {
    // This won't be used since these games are already in the diary
    console.log('Game already in diary:', gameId);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      league: '',
      season: '',
      playoff: '',
      search: '',
      mode: '',
    });
  };

  const getRootedForDisplay = (rootedFor: string, homeTeam: string, awayTeam: string) => {
    if (!rootedFor || rootedFor === 'none') {
      return <span className="text-gray-500">No team</span>;
    }
    
    // Use team abbreviations instead of full names
    const homeTeamAbbr = getTeamAbbreviation(homeTeam, 'MLB');
    const awayTeamAbbr = getTeamAbbreviation(awayTeam, 'MLB');
    
    // Determine which team they rooted for and get logo
    const isHomeTeam = rootedFor.toLowerCase() === homeTeam.toLowerCase();
    const teamAbbr = isHomeTeam ? homeTeamAbbr : awayTeamAbbr;
    
    return (
      <div className="flex items-center gap-1">
        <img 
          src={getTeamLogo(teamAbbr, 'MLB')} 
          alt={teamAbbr}
          className="h-4 w-4 object-contain"
        />
        <span>{teamAbbr}</span>
      </div>
    );
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

        {/* Filters */}
        <GameFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClearFilters={handleClearFilters}
          showModeFilter={true}
        />

        {/* Games Count */}
        {sortedLoggedGames.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {sortedLoggedGames.length} Games in Your Diary
            </h2>
          </div>
        )}

        {/* Games Grid with Enhanced GameCards */}
        {sortedLoggedGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLoggedGames.map((game, index) => (
              <div key={game.game_id} style={{ animationDelay: `${index * 0.1}s` }} className="h-full">
                <Card className="transition-shadow duration-200 animate-fade-in h-full flex flex-col relative">
                  {/* Edit/Delete overlay in top right */}
                  <div className="absolute top-2 right-2 flex space-x-1 z-10">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                      onClick={() => setEditingLog({ log: game.logData, game })}
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                      onClick={() => setDeletingLog({ log: game.logData, game })}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-3 flex-1 flex flex-col">
                    {/* GameCard content without footer */}
                    <GameCard
                      game={game}
                      onAddToDiary={handleAddToDiary}
                      isAuthenticated={!!user}
                      hideDiaryButton={true}
                    />
                  </CardContent>
                  
                  <CardFooter className="p-3 pt-0 border-t border-gray-200">
                    {/* Diary Metadata integrated into the card */}
                    <div className="w-full">
                      <div className="grid grid-cols-2 gap-1.5 text-sm mb-2">
                        <div>
                          <span className="font-medium text-gray-700">Mode:</span>
                          <span className="ml-2 capitalize text-gray-900">
                            {game.logData.mode === 'attended' ? '🏟️ Attended' : '📺 Watched'}
                          </span>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Rating:</span>
                          <span className="ml-2 text-gray-900">
                            {game.logData.rating ? 
                              `⭐ ${game.logData.rating}/5` : 
                              <span className="text-gray-500">Not rated</span>
                            }
                          </span>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Rooted for:</span>
                          <div className="ml-2 text-gray-900 inline-flex">
                            {getRootedForDisplay(game.logData.rooted_for, game.home_team, game.away_team)}
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Company:</span>
                          <span className="ml-2 text-gray-900">
                            {game.logData.company || 
                              <span className="text-gray-500">No company</span>
                            }
                          </span>
                        </div>
                      </div>
                      
                      {game.logData.notes && (
                        <div className="mb-2 pt-1.5 border-t border-gray-200">
                          <span className="font-medium text-gray-700">Notes:</span>
                          <p className="mt-1 text-gray-900 text-sm">{game.logData.notes}</p>
                        </div>
                      )}
                      
                      <div className="pt-1.5 border-t border-gray-200 text-xs text-gray-500">
                        Added: {new Date(game.logData.created_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
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

      {/* Modals */}
      {editingLog && (
        <EditGameLogModal
          isOpen={!!editingLog}
          onClose={() => setEditingLog(null)}
          gameLog={editingLog.log}
          game={editingLog.game}
          league="MLB"
        />
      )}
      
      {deletingLog && (
        <DeleteGameLogModal
          isOpen={!!deletingLog}
          onClose={() => setDeletingLog(null)}
          gameLog={deletingLog.log}
          game={deletingLog.game}
          league="MLB"
        />
      )}
    </Layout>
  );
};

export default Timeline;
