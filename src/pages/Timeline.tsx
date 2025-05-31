
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Calendar, Loader2, Edit, Trash2, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGameLogs } from '@/hooks/useGameLogs';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import EditGameLogModal from '@/components/EditGameLogModal';
import DeleteGameLogModal from '@/components/DeleteGameLogModal';
import GameFilters from '@/components/GameFilters';
import { getTeamLogo, getTeamAbbreviation } from '@/utils/teamLogos';
import { useMLBTeamCodes } from '@/hooks/useMLBTeamCodes';
import GameTeamDisplay from '@/components/game-card/GameTeamDisplay';
import GameScore from '@/components/game-card/GameScore';
import GameDateTime from '@/components/game-card/GameDateTime';
import { MapPin } from 'lucide-react';

const Timeline = () => {
  const { user } = useAuth();
  const { data: gameLogs, isLoading: logsLoading } = useGameLogs();
  const [editingLog, setEditingLog] = useState<any>(null);
  const [deletingLog, setDeletingLog] = useState<any>(null);
  const { data: teamCodeMap = {} } = useMLBTeamCodes();

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

  // Fetch MLB games - show all games
  const { data: mlbGames = [], isLoading: gamesLoading } = useGames({
    search: filters.search,
    league: 'MLB',
    season: filters.season,
    playoff: filters.playoff,
    startDate: filters.startDate,
    endDate: filters.endDate
  });

  // Only show loading when we're actually fetching data, not when filtering
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

  // Sort by game datetime descending (same as Games page), then by venue
  const sortedLoggedGames = filteredLoggedGames.sort((a, b) => {
    const dateA = a.date || a.game_date;
    const dateB = b.date || b.game_date;
    
    // First sort by date
    const dateComparison = dateB.localeCompare(dateA);
    if (dateComparison !== 0) {
      return dateComparison;
    }
    
    // If dates are the same, sort by time
    const timeA = a.game_datetime || a.game_time || '';
    const timeB = b.game_datetime || b.game_time || '';
    
    // For datetime fields, compare directly
    if (timeA && timeB) {
      const timeComparison = timeB.localeCompare(timeA);
      if (timeComparison !== 0) {
        return timeComparison;
      }
    }
    
    // If date and time are the same, sort by venue (ascending)
    const venueA = a.venue || a.venue_name || '';
    const venueB = b.venue || b.venue_name || '';
    return venueA.localeCompare(venueB);
  });

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

  const renderStarRating = (rating: number | null) => {
    if (!rating) {
      return <span className="text-gray-400">Not rated</span>;
    }

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRootedForDisplay = (rootedFor: string, homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) => {
    if (!rootedFor || rootedFor === 'none') {
      return (
        <div className="flex items-center justify-center gap-1 min-w-[60px]">
          <span className="text-gray-500">No team</span>
        </div>
      );
    }
    
    // Use team abbreviations instead of full names
    const homeTeamAbbr = getTeamAbbreviation(homeTeam, 'MLB');
    const awayTeamAbbr = getTeamAbbreviation(awayTeam, 'MLB');
    
    // Determine which team they rooted for and get logo
    const isHomeTeam = rootedFor.toLowerCase() === homeTeam.toLowerCase();
    const teamAbbr = isHomeTeam ? homeTeamAbbr : awayTeamAbbr;
    
    // Determine if their team won or lost (only for completed games)
    let winLossIndicator = '';
    if (homeScore !== null && awayScore !== null && homeScore !== awayScore) {
      const didWin = (isHomeTeam && homeScore > awayScore) || (!isHomeTeam && awayScore > homeScore);
      winLossIndicator = didWin ? ' (W)' : ' (L)';
    }
    
    return (
      <div className="flex items-center justify-center gap-1 min-w-[60px]">
        <img 
          src={getTeamLogo(teamAbbr, 'MLB')} 
          alt={teamAbbr}
          className="h-4 w-4 object-contain"
        />
        <span className="text-xs">{teamAbbr}{winLossIndicator}</span>
      </div>
    );
  };

  const generateBoxscoreUrl = (game: any) => {
    const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league, game.date);
    const year = new Date(game.date).getFullYear();
    let bbrefTeamCode = homeTeamAbbr;

    if (homeTeamAbbr === 'FLA' && year <= 2002) {
      bbrefTeamCode = 'FLO';
    } else if (homeTeamAbbr === 'LAA') {
      bbrefTeamCode = 'ANA';
    } else {
      const mappedTeamCode = teamCodeMap[homeTeamAbbr.toUpperCase()];
      bbrefTeamCode = mappedTeamCode || homeTeamAbbr;
    }

    bbrefTeamCode = bbrefTeamCode.toUpperCase();
    const date = game.date.replace(/-/g, '');
    const gameNumber = game.doubleheader === 'S' && game.game_num ? game.game_num.toString() : '0';

    return `https://www.baseball-reference.com/boxes/${bbrefTeamCode}/${bbrefTeamCode}${date}${gameNumber}.shtml`;
  };

  const getStatusTag = (game: any) => {
    if (game.game_type === 'E') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Exhibition</Badge>;
    }
    if (game.game_type === 'S') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Spring Training</Badge>;
    }
    if (game.playoff) {
      return <Badge variant="outline" className="border-sports-gold text-sports-gold">Playoff</Badge>;
    }
    return null;
  };

  const handleDeleteClose = () => {
    setDeletingLog(null);
  };

  // Only show loading spinner when we're actually fetching data
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
            <h1 className="text-4xl font-bold text-gray-900">Diary</h1>
          </div>
          <p className="text-lg text-gray-600">
            A personal record of every game you've attended or watched. Explore your timeline of moments that mattered.
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

        {/* Games Grid with Unified Cards */}
        {sortedLoggedGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLoggedGames.map((game, index) => {
              const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league, game.date);
              const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league, game.date);
              const statusTag = getStatusTag(game);

              return (
                <div key={game.game_id} style={{ animationDelay: `${index * 0.1}s` }} className="h-full">
                  <Card className="transition-shadow duration-200 animate-fade-in h-full flex flex-col relative">
                    {/* Edit/Delete controls in top right */}
                    <div className="absolute top-3 right-3 flex space-x-1 z-10">
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
                      {/* Game info section - matching GameCard layout */}
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <Badge variant="secondary" className="bg-field-green text-white">
                            {game.league}
                          </Badge>
                          {statusTag}
                        </div>
                      </div>

                      {game.venue && (
                        <div className="flex items-center justify-center text-sm text-gray-600 mb-1.5">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-center">{game.venue}</span>
                        </div>
                      )}

                      <div className="text-center mb-1 flex-1 flex flex-col justify-center">
                        <GameTeamDisplay 
                          homeTeam={homeTeamAbbr}
                          awayTeam={awayTeamAbbr}
                          league={game.league}
                          gameDate={game.date}
                        />
                        <GameScore 
                          league={game.league}
                          ptsOff={game.pts_off}
                          ptsDef={game.pts_def}
                          runsScored={game.runs_scored}
                          runsAllowed={game.runs_allowed}
                        />
                      </div>

                      <div className="text-center flex flex-col justify-start">
                        <GameDateTime date={game.date} gameDateTime={game.game_datetime} />
                      </div>
                    </CardContent>

                    {/* Footer with boxscore button and metadata */}
                    <div className="border-t border-gray-200 mx-3"></div>
                    <CardFooter className="p-3 pt-2">
                      <div className="w-full">
                        {/* Boxscore button - always show for all games */}
                        <div className="mb-3">
                          <a 
                            href={generateBoxscoreUrl(game)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-field-green text-field-green bg-transparent hover:bg-field-light transition-colors"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Boxscore
                            </Button>
                          </a>
                        </div>

                        {/* Diary metadata */}
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-center">
                              <span className="font-medium block">Mode:</span>
                              <span className="capitalize">
                                {game.logData.mode === 'attended' ? '🏟️ Attended' : '📺 Watched'}
                              </span>
                            </div>
                            
                            <div className="text-center">
                              <span className="font-medium block">Rating:</span>
                              <div className="flex justify-center">
                                {renderStarRating(game.logData.rating)}
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <span className="font-medium block">Rooted for:</span>
                              <div className="flex justify-center">
                                {getRootedForDisplay(game.logData.rooted_for, game.home_team, game.away_team, game.runs_scored, game.runs_allowed)}
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <span className="font-medium block">Company:</span>
                              <div className="truncate px-1" title={game.logData.company || 'Solo'}>
                                {game.logData.company || 
                                  <span className="text-gray-400">Solo</span>
                                }
                              </div>
                            </div>
                          </div>
                          
                          {/* Always show Notes section */}
                          <div className="pt-1.5 border-t border-gray-100">
                            <span className="font-medium">Notes:</span>
                            <p className="mt-0.5 text-gray-700 truncate">
                              {game.logData.notes || <span className="text-gray-400">No notes</span>}
                            </p>
                          </div>
                          
                          <div className="pt-1.5 border-t border-gray-100 text-gray-400 text-center">
                            Added: {new Date(game.logData.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              );
            })}
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
          onClose={handleDeleteClose}
          gameLog={deletingLog.log}
          game={deletingLog.game}
          league="MLB"
        />
      )}
    </Layout>
  );
};

export default Timeline;
