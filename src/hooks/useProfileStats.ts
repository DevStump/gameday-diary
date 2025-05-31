
import { useQuery } from '@tanstack/react-query';
import { useGameLogs } from './useGameLogs';
import { useGames } from './useGames';
import { getTeamAbbreviation } from '@/utils/teamLogos';

const ensureAbbreviation = (team: string, league: 'MLB' | 'NFL', date: string): string => {
  if (team.length === 3 && team === team.toUpperCase()) return team;
  return getTeamAbbreviation(team, league, date);
};

export const useProfileStats = () => {
  const { data: gameLogs } = useGameLogs();
  const { data: mlbGames } = useGames({ search: '', league: 'MLB', season: '', playoff: '', startDate: '', endDate: '' });

  return useQuery({
    queryKey: ['profile-stats', gameLogs],
    queryFn: () => {
      if (!gameLogs || !mlbGames) return null;

      // 12-month rolling window
      const now = new Date();
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setFullYear(now.getFullYear() - 1);

      const gameMap = Object.fromEntries(mlbGames.map(g => [String(g.game_id), g]));

      // Filter game logs to 12-month window
      const filteredGameLogs = gameLogs.filter(log => {
        const game = gameMap[String(log.game_id)];
        if (!game) return false;
        const gameDate = new Date(game.game_date || game.game_datetime);
        return gameDate >= twelveMonthsAgo && gameDate <= now;
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

      // Read venues directly from database logs (only attended games)
      const attendedVenueCounts: Record<string, number> = {};
      const rootedForCounts: Record<string, number> = {};
      const teamCounts: Record<string, number> = {};
      const teamWins: Record<string, number> = {};
      const teamLosses: Record<string, number> = {};
      let totalRuns = 0;
      let wins = 0;
      let losses = 0;
      let highestScoringGame = { runs: 0, teams: '', date: '', venue: '' };
      let lowestScoringGame = { runs: Infinity, teams: '', date: '', venue: '' };

      // Process filtered game logs
      filteredGameLogs.forEach(log => {
        const game = gameMap[String(log.game_id)];
        if (!game) return;

        const date = new Date(game.game_date || game.game_datetime);
        const dateString = date.toISOString();

        // Only count attended venues
        if (game.venue_name && log.mode === 'attended') {
          attendedVenueCounts[game.venue_name] = (attendedVenueCounts[game.venue_name] || 0) + 1;
        }

        // Rooted for counts (normalize to abbreviation)
        const rootedRaw = log.rooted_for;
        if (rootedRaw && rootedRaw !== 'none') {
          const rooted = ensureAbbreviation(rootedRaw, 'MLB', dateString);
          rootedForCounts[rooted] = (rootedForCounts[rooted] || 0) + 1;

          // Win/loss calc
          const homeScore = game.home_score ?? game.runs_scored ?? 0;
          const awayScore = game.away_score ?? game.runs_allowed ?? 0;
          const homeTeam = ensureAbbreviation(game.home_team ?? game.home_name, 'MLB', dateString);
          const awayTeam = ensureAbbreviation(game.away_team ?? game.away_name, 'MLB', dateString);

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
        const gameRuns = (game.home_score ?? game.runs_scored ?? 0) + (game.away_score ?? game.runs_allowed ?? 0);
        totalRuns += gameRuns;

        const homeAbbr = ensureAbbreviation(game.home_team ?? game.home_name, 'MLB', dateString);
        const awayAbbr = ensureAbbreviation(game.away_team ?? game.away_name, 'MLB', dateString);

        // Track highest scoring game
        if (gameRuns > highestScoringGame.runs) {
          highestScoringGame = {
            runs: gameRuns,
            teams: `${awayAbbr} @ ${homeAbbr}`,
            date: game.game_date,
            venue: game.venue_name || ''
          };
        }

        // Track lowest scoring game (only if game has been played)
        if (gameRuns < lowestScoringGame.runs && gameRuns > 0) {
          lowestScoringGame = {
            runs: gameRuns,
            teams: `${awayAbbr} @ ${homeAbbr}`,
            date: game.game_date,
            venue: game.venue_name || ''
          };
        }

        // Team breakdown
        teamCounts[homeAbbr] = (teamCounts[homeAbbr] || 0) + 1;
        teamCounts[awayAbbr] = (teamCounts[awayAbbr] || 0) + 1;
      });

      // Get last 5 rooted games (most recent first)
      const rootedGameLogs = filteredGameLogs
        .filter(log => log.rooted_for && log.rooted_for !== 'none')
        .map(log => ({ ...log, game: gameMap[String(log.game_id)] }))
        .filter(log => log.game)
        .sort((a, b) => {
          const dateA = new Date(a.game.game_date || a.game.game_datetime);
          const dateB = new Date(b.game.game_date || b.game.game_datetime);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5)
        .map(log => {
          const { game } = log;
          const homeScore = game.home_score ?? game.runs_scored ?? 0;
          const awayScore = game.away_score ?? game.runs_allowed ?? 0;
          const homeAbbr = ensureAbbreviation(game.home_team ?? game.home_name, 'MLB', game.game_date || game.game_datetime);
          const awayAbbr = ensureAbbreviation(game.away_team ?? game.away_name, 'MLB', game.game_date || game.game_datetime);
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

      const attendedVenueBreakdown = Object.entries(attendedVenueCounts).sort(([, a], [, b]) => b - a).slice(0, 3);
      const highestRatedGame = Math.max(...ratedGames.map(log => log.rating), 0);

      // Calculate average runs per game
      const avgRunsPerGame = totalGames > 0 ? Math.round((totalRuns / totalGames) * 10) / 10 : 0;

      // Calculate 12-month window dates for display
      const windowStart = twelveMonthsAgo.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const windowEnd = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

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
        timeWindow: { start: windowStart, end: windowEnd },
      };
    },
    enabled: !!gameLogs && !!mlbGames,
  });
};
