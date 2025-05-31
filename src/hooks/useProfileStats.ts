import { useQuery } from '@tanstack/react-query';
import { useGameLogs } from './useGameLogs';
import { useGames } from './useGames';

export const useProfileStats = () => {
  const { data: gameLogs } = useGameLogs();
  const { data: nflGames } = useGames({ search: '', league: 'NFL', season: '', playoff: '', startDate: '', endDate: '' });
  const { data: mlbGames } = useGames({ search: '', league: 'MLB', season: '', playoff: '', startDate: '', endDate: '' });

  return useQuery({
    queryKey: ['profile-stats', gameLogs],
    queryFn: () => {
      if (!gameLogs || !nflGames || !mlbGames) return null;

      const allGames = [...nflGames, ...mlbGames];
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

        console.log('Processing game log:', {
          gameId: log.game_id,
          rootedFor: log.rooted_for,
          game: {
            home_team: game.home_team,
            away_team: game.away_team,
            home_name: game.home_name,
            away_name: game.away_name,
            home_score: game.home_score,
            away_score: game.away_score,
            runs_scored: game.runs_scored,
            runs_allowed: game.runs_allowed,
            pts_off: game.pts_off,
            pts_def: game.pts_def
          }
        });

        // Venue counts
        if (game.venue_name) {
          const venue = game.venue_name;
          venueCounts[venue] = (venueCounts[venue] || 0) + 1;
        }

        // Rooted for counts
        const rooted = log.rooted_for;
        if (rooted && rooted !== 'none') {
          rootedForCounts[rooted] = (rootedForCounts[rooted] || 0) + 1;
        }

        // Win/loss calculation - improved logic
        if (rooted && rooted !== 'none') {
          const isNflGame = nflGames.some(nfl => nfl.game_id === game.game_id);
          let homeTeam, awayTeam, homeScore, awayScore;

          if (isNflGame) {
            // NFL game
            homeTeam = game.home_team;
            awayTeam = game.away_team;
            homeScore = game.pts_off ?? 0;
            awayScore = game.pts_def ?? 0;
          } else {
            // MLB game - use both possible field combinations
            homeTeam = game.home_team ?? game.home_name;
            awayTeam = game.away_team ?? game.away_name;
            homeScore = game.home_score ?? game.runs_scored ?? 0;
            awayScore = game.away_score ?? game.runs_allowed ?? 0;
          }

          console.log('Win/Loss calculation:', {
            rootedFor: rooted,
            homeTeam,
            awayTeam,
            homeScore,
            awayScore,
            isNflGame
          });

          // Only process if we have valid scores and the game is finished
          if (homeScore !== null && awayScore !== null && homeScore !== awayScore) {
            let didRootedTeamWin = false;

            // Check if rooted team is home or away and if they won
            if (homeTeam && (homeTeam === rooted || homeTeam.includes(rooted) || rooted.includes(homeTeam))) {
              didRootedTeamWin = homeScore > awayScore;
            } else if (awayTeam && (awayTeam === rooted || awayTeam.includes(rooted) || rooted.includes(awayTeam))) {
              didRootedTeamWin = awayScore > homeScore;
            }

            console.log('Result:', { didRootedTeamWin });

            if (didRootedTeamWin) {
              wins++;
              teamWins[rooted] = (teamWins[rooted] || 0) + 1;
            } else {
              losses++;
              teamLosses[rooted] = (teamLosses[rooted] || 0) + 1;
            }
          }
        }

        // Total runs
        const isNflGame = nflGames.some(nfl => nfl.game_id === game.game_id);
        if (isNflGame) {
          totalRuns += (game.pts_off ?? 0) + (game.pts_def ?? 0);
        } else {
          totalRuns += (game.home_score ?? game.runs_scored ?? 0) + (game.away_score ?? game.runs_allowed ?? 0);
        }

        // Team counts
        const home = game.home_team ?? game.home_name;
        const away = game.away_team ?? game.away_name;
        if (home) teamCounts[home] = (teamCounts[home] || 0) + 1;
        if (away) teamCounts[away] = (teamCounts[away] || 0) + 1;

        // Timeline
        const gameDate = new Date(game.game_date ?? game.game_datetime);
        const key = `${gameDate.getFullYear()}-${String(gameDate.getMonth() + 1).padStart(2, '0')}`;
        timeline[key] = (timeline[key] || 0) + 1;
      });

      console.log('Final win/loss totals:', { wins, losses });

      const mostVisitedVenue = Object.entries(venueCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
      const mostSupportedEntry = Object.entries(rootedForCounts).sort(([, a], [, b]) => b - a)[0];
      const mostSupportedTeam = mostSupportedEntry
        ? { team: mostSupportedEntry[0], count: mostSupportedEntry[1] }
        : null;


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
        mostSupportedTeam,
        gameTimelineData,
        totalRuns,
        venueBreakdown,
      };
    },
    enabled: !!gameLogs && !!nflGames && !!mlbGames,
  });
};
