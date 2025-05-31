
import { useQuery } from '@tanstack/react-query';
import { useGameLogs } from './useGameLogs';
import { useGames } from './useGames';

export const useProfileStats = () => {
  const { data: gameLogs } = useGameLogs();
  const { data: nflGames } = useGames({
    search: '',
    league: 'NFL',
    season: '',
    playoff: '',
    startDate: '',
    endDate: ''
  });
  const { data: mlbGames } = useGames({
    search: '',
    league: 'MLB',
    season: '',
    playoff: '',
    startDate: '',
    endDate: ''
  });

  return useQuery({
    queryKey: ['profile-stats', gameLogs],
    queryFn: () => {
      if (!gameLogs || !nflGames || !mlbGames) return null;

      console.log('Computing profile stats...');
      console.log('Game logs count:', gameLogs.length);
      console.log('NFL games count:', nflGames?.length);
      console.log('MLB games count:', mlbGames?.length);

      const allGames = [...(nflGames || []), ...(mlbGames || [])];
      console.log('Total games available:', allGames.length);
      
      // Basic counts
      const totalGames = gameLogs.length;
      const gamesAttended = gameLogs.filter(log => log.mode === 'attended').length;
      const gamesWatched = gameLogs.filter(log => log.mode === 'watched').length;
      
      // Average rating rounded to 2 decimal places
      const ratedGames = gameLogs.filter(log => log.rating && log.rating > 0);
      const avgRating = ratedGames.length > 0 
        ? Math.round((ratedGames.reduce((sum, log) => sum + log.rating, 0) / ratedGames.length) * 100) / 100
        : 0;

      const venueCounts: Record<string, number> = {};
      
      gameLogs.forEach(log => {
        const game = allGames.find(g => g.game_id === log.game_id);
        if (game?.venue_name) {
          const venue = game.venue_name;
          venueCounts[venue] = (venueCounts[venue] || 0) + 1;
        }
      });
      
      const mostVisitedVenue = Object.entries(venueCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;


      console.log('Venue counts:', venueCounts);
      const mostVisitedVenue = Object.entries(venueCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

      // Teams rooted for breakdown
      const rootedForCounts: Record<string, number> = {};
      gameLogs.forEach(log => {
        if (log.rooted_for && log.rooted_for !== 'none') {
          rootedForCounts[log.rooted_for] = (rootedForCounts[log.rooted_for] || 0) + 1;
        }
      });

      const mostSupportedTeam = Object.entries(rootedForCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

      // Win/Loss Record based on rooted_for vs winning_team/losing_team from actual games
      let wins = 0;
      let losses = 0;
      const teamWins: Record<string, number> = {};
      const teamLosses: Record<string, number> = {};
      
      gameLogs.forEach(log => {
        const rooted = log.rooted_for;
        if (!rooted || rooted === 'none') return;

        const game = allGames.find(g => g.game_id === log.game_id);
        if (!game) return;

        // For NFL games, determine winner from pts_off vs pts_def
        // For MLB games, determine winner from home_score vs away_score
        let winningTeam, losingTeam;
        
        const isNflGame = nflGames?.some(nflGame => nflGame.game_id === game.game_id);
        
        if (isNflGame) {
          if (game.pts_off !== undefined && game.pts_def !== undefined) {
            if (game.pts_off > game.pts_def) {
              winningTeam = game.home_team;
              losingTeam = game.away_team;
            } else if (game.pts_def > game.pts_off) {
              winningTeam = game.away_team;
              losingTeam = game.home_team;
            }
          }
        } else {
          // MLB game
          const homeScore = game.home_score || game.runs_scored;
          const awayScore = game.away_score || game.runs_allowed;
          
          if (homeScore !== undefined && awayScore !== undefined) {
            if (homeScore > awayScore) {
              winningTeam = game.home_team || game.home_name;
              losingTeam = game.away_team || game.away_name;
            } else if (awayScore > homeScore) {
              winningTeam = game.away_team || game.away_name;
              losingTeam = game.home_team || game.home_name;
            }
          }
        }

        if (winningTeam === rooted) {
          wins++;
          teamWins[rooted] = (teamWins[rooted] || 0) + 1;
        } else if (losingTeam === rooted) {
          losses++;
          teamLosses[rooted] = (teamLosses[rooted] || 0) + 1;
        }
      });

      console.log('Win/Loss record:', { wins, losses });
      console.log('Team wins:', teamWins);
      console.log('Team losses:', teamLosses);

      const mostWinsEntry = Object.entries(teamWins).sort(([,a], [,b]) => b - a)[0];
      const mostLossesEntry = Object.entries(teamLosses).sort(([,a], [,b]) => b - a)[0];

      const teamWinRecord = {
        mostWins: mostWinsEntry ? { team: mostWinsEntry[0], count: mostWinsEntry[1] } : null,
        mostLosses: mostLossesEntry ? { team: mostLossesEntry[0], count: mostLossesEntry[1] } : null,
      };

      // Total Runs/Points from logged games
      const totalRuns = gameLogs.reduce((sum, log) => {
        const game = allGames.find(g => g.game_id === log.game_id);
        if (game) {
          const isNflGame = nflGames?.some(nflGame => nflGame.game_id === game.game_id);
          
          if (isNflGame) {
            // NFL: pts_off + pts_def
            const homeScore = game.pts_off || 0;
            const awayScore = game.pts_def || 0;
            return sum + homeScore + awayScore;
          } else {
            // MLB: home_score + away_score
            const homeScore = game.home_score || game.runs_scored || 0;
            const awayScore = game.away_score || game.runs_allowed || 0;
            return sum + homeScore + awayScore;
          }
        }
        return sum;
      }, 0);

      console.log('Total runs/points:', totalRuns);

      // Top Teams - count games involving each team from logged games
      const teamCounts: Record<string, number> = {};
      gameLogs.forEach(log => {
        const game = allGames.find(g => g.game_id === log.game_id);
        if (game) {
          const homeTeam = game.home_team || game.home_name;
          const awayTeam = game.away_team || game.away_name;
          
          if (homeTeam) {
            teamCounts[homeTeam] = (teamCounts[homeTeam] || 0) + 1;
          }
          if (awayTeam) {
            teamCounts[awayTeam] = (teamCounts[awayTeam] || 0) + 1;
          }
        }
      });

      console.log('Team counts:', teamCounts);
      const teamBreakdown = Object.entries(teamCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      // Games by Date Timeline - use actual game dates from logged games
      const timeline: Record<string, number> = {};
      
      gameLogs.forEach(log => {
        const game = allGames.find(g => g.game_id === log.game_id);
        if (game && (game.game_date || game.game_datetime)) {
          const gameDate = new Date(game.game_date || game.game_datetime);
          const monthYear = `${gameDate.getFullYear()}-${String(gameDate.getMonth() + 1).padStart(2, '0')}`;
          timeline[monthYear] = (timeline[monthYear] || 0) + 1;
        }
      });

      const gameTimelineData = Object.entries(timeline)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([monthYear, count]) => {
          const [year, month] = monthYear.split('-');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return {
            month: `${monthNames[parseInt(month) - 1]} ${year}`,
            games: count
          };
        })
        .slice(-12); // Last 12 months

      // Highest rated game
      const highestRatedGame = Math.max(...ratedGames.map(log => log.rating), 0);

      // Venue breakdown for potential future use
      const venueBreakdown = Object.entries(venueCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      console.log('Final stats computed:', {
        totalGames,
        mostVisitedVenue,
        totalRuns,
        teamBreakdown: teamBreakdown.slice(0, 3)
      });

      return {
        totalGames,
        gamesWatched,
        gamesAttended,
        avgRating,
        winRecord: { wins, losses },
        teamWinRecord,
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
