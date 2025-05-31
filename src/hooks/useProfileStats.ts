import { useQuery } from '@tanstack/react-query';
import { useGameLogs } from './useGameLogs';
import { useGames } from './useGames';
import { getTeamAbbreviation } from '@/utils/teamLogos';

const ensureAbbreviation = (team: string, league: 'MLB', date: string): string => {
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

      const allGames = [...mlbGames];
      const gameMap = Object.fromEntries(allGames.map(g => [String(g.game_id), g]));

      const totalGames = gameLogs.length;
      const gamesAttended = gameLogs.filter(log => log.mode === 'attended').length;
      const gamesWatched = gameLogs.filter(log => log.mode === 'watched').length;

      const ratedGames = gameLogs.filter(log => log.rating && log.rating > 0);
      const avgRating = ratedGames.length
        ? Math.round((ratedGames.reduce((sum, log) => sum + log.rating, 0) / ratedGames.length) * 100) / 100
        : 0;

      const venueCounts: Record<string, number> = {};
      const rootedForCounts: Record<string, number> = {};
      const teamCounts: Record<string, number> = {};
      const timeline: Record<string, number> = {};
      const teamWins: Record<string, number> = {};
      const teamLosses: Record<string, number> = {};
      let totalRuns = 0;
      let wins = 0;
      let losses = 0;

      gameLogs.forEach(log => {
        const game = gameMap[String(log.game_id)];
        if (!game) return;

        const date = new Date(game.game_date || game.game_datetime);
        const dateString = date.toISOString();

        // Venue counts
        if (game.venue_name) {
          venueCounts[game.venue_name] = (venueCounts[game.venue_name] || 0) + 1;
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
        totalRuns += (game.home_score ?? game.runs_scored ?? 0) + (game.away_score ?? game.runs_allowed ?? 0);

        // Team breakdown
        const homeAbbr = ensureAbbreviation(game.home_team ?? game.home_name, 'MLB', dateString);
        const awayAbbr = ensureAbbreviation(game.away_team ?? game.away_name, 'MLB', dateString);
        teamCounts[homeAbbr] = (teamCounts[homeAbbr] || 0) + 1;
        teamCounts[awayAbbr] = (teamCounts[awayAbbr] || 0) + 1;

        // Timeline
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        timeline[month] = (timeline[month] || 0) + 1;
      });

      const mostVisitedVenue = Object.entries(venueCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
      const [mostSupportedTeamAbbr, mostSupportedTeamCount] = Object.entries(rootedForCounts).sort(([, a], [, b]) => b - a)[0] || ['N/A', 0];
      const mostWinsEntry = Object.entries(teamWins).sort(([, a], [, b]) => b - a)[0];
      const mostLossesEntry = Object.entries(teamLosses).sort(([, a], [, b]) => b - a)[0];
      const teamBreakdown = Object.entries(teamCounts).sort(([, a], [, b]) => b - a).slice(0, 5);

      const gameTimelineData = Object.entries(timeline)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, count]) => {
          const [year, month] = key.split('-');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return { month: `${monthNames[parseInt(month) - 1]} ${year}`, games: count };
        })
        .slice(-12);

      const venueBreakdown = Object.entries(venueCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
      const highestRatedGame = Math.max(...ratedGames.map(log => log.rating), 0);

      return {
        totalGames,
        gamesWatched,
        gamesAttended,
        avgRating,
        winRecord: { wins, losses },
        teamWinRecord: {
          mostWins: mostWinsEntry ? { team: mostWinsEntry[0], count: mostWinsEntry[1] } : null,
          mostLosses: mostLossesEntry ? { team: mostLossesEntry[0], count: mostLossesEntry[1] } : null,
        },
        highestRatedGame,
        teamBreakdown,
        mostVisitedVenue,
        mostSupportedTeam: { team: mostSupportedTeamAbbr, count: mostSupportedTeamCount },
        gameTimelineData,
        totalRuns,
        venueBreakdown,
      };
    },
    enabled: !!gameLogs && !!mlbGames,
  });
};
