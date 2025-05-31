
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useGameLogs } from './useGameLogs';
import { getTeamAbbreviation } from '@/utils/teamLogos';

const ensureAbbreviation = (team: string, league: 'MLB' | 'NFL', date: string): string => {
  if (team.length === 3 && team === team.toUpperCase()) return team;
  return getTeamAbbreviation(team, league, date);
};

export const useProfileStats = () => {
  const { user } = useAuth();
  const { data: gameLogs = [], isLoading: logsLoading } = useGameLogs();

  return useQuery({
    queryKey: ['profile-stats', user?.id, gameLogs],
    queryFn: async () => {
      if (!user || !gameLogs || gameLogs.length === 0) return null;

      // Extract unique game IDs from logs
      const gameIds = [...new Set(gameLogs.map(log => parseInt(log.game_id)))];
      
      // Fetch only the games that have logs - RLS will automatically filter accessible games
      const { data: mlbGames, error } = await supabase
        .from('mlb_schedule')
        .select('*')
        .in('game_id', gameIds);

      if (error) {
        console.error('Error fetching MLB games:', error);
        throw error;
      }

      if (!mlbGames) return null;

      // Create a map for quick game lookup
      const gameMap = Object.fromEntries(mlbGames.map(g => [String(g.game_id), g]));

      // Filter game logs to only include those with corresponding games
      const filteredGameLogs = gameLogs.filter(log => {
        const game = gameMap[String(log.game_id)];
        return !!game;
      });

      const totalGames = filteredGameLogs.length;
      const gamesAttended = filteredGameLogs.filter(log => log.mode === 'attended').length;
      const gamesWatched = filteredGameLogs.filter(log => log.mode === 'watched').length;

      const ratedGames = filteredGameLogs.filter(log => log.rating && log.rating > 0);
      const avgRating = ratedGames.length
        ? Math.round((ratedGames.reduce((sum, log) => sum + log.rating, 0) / ratedGames.length) * 10) / 10
        : 0;

      // Rating breakdown
      const ratingBreakdown = {
        1: ratedGames.filter(log => log.rating === 1).length,
        2: ratedGames.filter(log => log.rating === 2).length,
        3: ratedGames.filter(log => log.rating === 3).length,
        4: ratedGames.filter(log => log.rating === 4).length,
        5: ratedGames.filter(log => log.rating === 5).length,
      };

      // Top venues - only count attended games
      const attendedVenueCounts: Record<string, number> = {};
      filteredGameLogs.forEach(log => {
        const game = gameMap[String(log.game_id)];
        if (!game) return;
        
        if (game.venue_name && log.mode === 'attended') {
          attendedVenueCounts[game.venue_name] = (attendedVenueCounts[game.venue_name] || 0) + 1;
        }
      });

      // Process games with rooted team data for win/loss and team stats
      const rootedForCounts: Record<string, number> = {};
      const teamCounts: Record<string, number> = {};
      const teamWins: Record<string, number> = {};
      const teamLosses: Record<string, number> = {};
      let totalRuns = 0;
      let wins = 0;
      let losses = 0;
      let highestScoringGame = { runs: 0, teams: '', date: '', venue: '' };
      let lowestScoringGame = { runs: Infinity, teams: '', date: '', venue: '' };

      filteredGameLogs.forEach(log => {
        const game = gameMap[String(log.game_id)];
        if (!game) return;

        const date = new Date(game.game_date || game.game_datetime);
        const dateString = date.toISOString();

        // Rooted for counts
        const rootedRaw = log.rooted_for;
        if (rootedRaw && rootedRaw !== 'none') {
          const rooted = ensureAbbreviation(rootedRaw, 'MLB', dateString);
          rootedForCounts[rooted] = (rootedForCounts[rooted] || 0) + 1;

          // Win/loss calc
          const homeScore = game.home_score ?? 0;
          const awayScore = game.away_score ?? 0;
          const homeTeam = ensureAbbreviation(game.home_name, 'MLB', dateString);
          const awayTeam = ensureAbbreviation(game.away_name, 'MLB', dateString);

          let winner: string | undefined;
          let loser: string | undefined;

          if (homeScore > awayScore) {
            winner = homeTeam;
            loser = awayTeam;
          } else if (awayScore > homeScore) {
            winner = awayTeam;
            loser = homeTeam;
          }

          if (rooted === winner) {
            wins++;
            teamWins[rooted] = (teamWins[rooted] || 0) + 1;
          } else if (rooted === loser) {
            losses++;
            teamLosses[rooted] = (teamLosses[rooted] || 0) + 1;
          }
        }

        // Total runs
        const gameRuns = (game.home_score ?? 0) + (game.away_score ?? 0);
        totalRuns += gameRuns;

        const homeAbbr = ensureAbbreviation(game.home_name, 'MLB', dateString);
        const awayAbbr = ensureAbbreviation(game.away_name, 'MLB', dateString);

        // Track highest scoring game
        if (gameRuns > highestScoringGame.runs) {
          highestScoringGame = {
            runs: gameRuns,
            teams: `${awayAbbr} @ ${homeAbbr}`,
            date: game.game_date,
            venue: game.venue_name || ''
          };
        }

        // Track lowest scoring game
        if (gameRuns < lowestScoringGame.runs && gameRuns > 0) {
          lowestScoringGame = {
            runs: gameRuns,
            teams: `${awayAbbr} @ ${homeAbbr}`,
            date: game.game_date,
            venue: game.venue_name || ''
          };
        }

        // Team breakdown - count all games
        teamCounts[homeAbbr] = (teamCounts[homeAbbr] || 0) + 1;
        teamCounts[awayAbbr] = (teamCounts[awayAbbr] || 0) + 1;
      });

      // Get last 5 rooted games (most recent first)
      const rootedGameLogs = filteredGameLogs
        .filter(log => log.rooted_for && log.rooted_for !== 'none')
        .map(log => ({ ...log, game: gameMap[String(log.game_id)] }))
        .filter(log => log.game)
        .sort((a, b) => {
          const gameTimeA = new Date(a.game.game_datetime || a.game.game_date).getTime();
          const gameTimeB = new Date(b.game.game_datetime || b.game.game_date).getTime();
          return gameTimeB - gameTimeA;
        })
        .slice(0, 5)
        .map(log => {
          const { game } = log;
          const homeScore = game.home_score ?? 0;
          const awayScore = game.away_score ?? 0;
          const homeAbbr = ensureAbbreviation(game.home_name, 'MLB', game.game_date || game.game_datetime);
          const awayAbbr = ensureAbbreviation(game.away_name, 'MLB', game.game_date || game.game_datetime);
          const rootedAbbr = ensureAbbreviation(log.rooted_for, 'MLB', game.game_date || game.game_datetime);

          let won = false;
          if (homeScore !== awayScore) {
            const winner = homeScore > awayScore ? homeAbbr : awayAbbr;
            won = rootedAbbr === winner;
          }

          return { won };
        });

      const mostSupportedTeamEntry = Object.entries(rootedForCounts).sort(([, a], [, b]) => b - a)[0];
      const mostSupportedTeam = mostSupportedTeamEntry ? {
        team: mostSupportedTeamEntry[0],
        count: mostSupportedTeamEntry[1]
      } : { team: 'N/A', count: 0 };

      const mostWinsEntry = Object.entries(teamWins).sort(([, a], [, b]) => b - a)[0];
      const mostLossesEntry = Object.entries(teamLosses).sort(([, a], [, b]) => b - a)[0];
      const teamBreakdown = Object.entries(teamCounts).sort(([, a], [, b]) => b - a).slice(0, 5);

      const attendedVenueBreakdown = Object.entries(attendedVenueCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
      const highestRatedGame = Math.max(...ratedGames.map(log => log.rating), 0);

      // Calculate average runs per game
      const avgRunsPerGame = totalGames > 0 ? Math.round((totalRuns / totalGames) * 10) / 10 : 0;

      return {
        totalGames,
        gamesWatched,
        gamesAttended,
        avgRating,
        ratingBreakdown,
        ratedGamesCount: ratedGames.length,
        winRecord: { wins, losses },
        teamWinRecord: {
          mostWins: mostWinsEntry ? { team: mostWinsEntry[0], count: mostWinsEntry[1] } : null,
          mostLosses: mostLossesEntry ? { team: mostLossesEntry[0], count: mostLossesEntry[1] } : null,
        },
        highestRatedGame,
        teamBreakdown,
        mostSupportedTeam,
        totalRuns,
        avgRunsPerGame,
        last5Games: rootedGameLogs,
        highestScoringGame: highestScoringGame.runs > 0 ? highestScoringGame : null,
        lowestScoringGame: lowestScoringGame.runs < Infinity ? lowestScoringGame : null,
        attendedVenueBreakdown,
      };
    },
    enabled: !!user && !!gameLogs && gameLogs.length > 0,
  });
};
