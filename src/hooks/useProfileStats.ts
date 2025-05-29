
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

      const allGames = [...(nflGames || []), ...(mlbGames || [])];
      
      // Basic counts
      const totalGames = gameLogs.length;
      const gamesAttended = gameLogs.filter(log => log.mode === 'attended').length;
      const gamesWatched = gameLogs.filter(log => log.mode === 'watched').length;
      
      // Average rating rounded to 2 decimal places
      const ratedGames = gameLogs.filter(log => log.rating && log.rating > 0);
      const avgRating = ratedGames.length > 0 
        ? Math.round((ratedGames.reduce((sum, log) => sum + log.rating, 0) / ratedGames.length) * 100) / 100
        : 0;

      // Win/Loss record based on rooted team's actual performance
      let wins = 0;
      let losses = 0;
      
      gameLogs.forEach(log => {
        // Only count games where user actually rooted for a team
        if (log.rooted_for && log.rooted_for !== 'none') {
          const game = allGames.find(g => g.game_id === log.game_id);
          if (game) {
            let teamScore, oppScore;
            
            // Determine league based on which array contains the game
            const league = nflGames?.includes(game) ? 'NFL' : 'MLB';
            
            if (league === 'NFL' && game.pts_off !== undefined && game.pts_def !== undefined) {
              const isHome = log.rooted_for === game.home_team;
              // Fixed: pts_off is home team score, pts_def is away team score
              teamScore = isHome ? game.pts_off : game.pts_def;
              oppScore = isHome ? game.pts_def : game.pts_off;
            } else if (league === 'MLB' && game.runs_scored !== undefined && game.runs_allowed !== undefined) {
              const isHome = log.rooted_for === game.home_team;
              teamScore = isHome ? game.runs_scored : game.runs_allowed;
              oppScore = isHome ? game.runs_allowed : game.runs_scored;
            }
            
            if (teamScore !== undefined && oppScore !== undefined) {
              if (teamScore > oppScore) {
                wins++;
              } else {
                losses++;
              }
            }
          }
        }
      });

      // League breakdown
      const nflLogs = gameLogs.filter(log => 
        allGames.find(g => g.game_id === log.game_id && nflGames?.includes(g))
      );
      const mlbLogs = gameLogs.filter(log => 
        allGames.find(g => g.game_id === log.game_id && mlbGames?.includes(g))
      );

      // Team breakdown - count games by team
      const teamCounts: Record<string, number> = {};
      gameLogs.forEach(log => {
        const game = allGames.find(g => g.game_id === log.game_id);
        if (game) {
          // Count both home and away teams
          teamCounts[game.home_team] = (teamCounts[game.home_team] || 0) + 1;
          teamCounts[game.away_team] = (teamCounts[game.away_team] || 0) + 1;
        }
      });

      // Sort teams by count and get top teams
      const sortedTeams = Object.entries(teamCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5); // Top 5 teams

      // Playoff games
      const playoffGames = gameLogs.filter(log => {
        const game = allGames.find(g => g.game_id === log.game_id);
        return game?.playoff;
      }).length;

      return {
        totalGames,
        gamesWatched,
        gamesAttended,
        avgRating,
        winRecord: { wins, losses },
        nflGames: nflLogs.length,
        mlbGames: mlbLogs.length,
        playoffGames,
        highestRatedGame: Math.max(...ratedGames.map(log => log.rating), 0),
        teamBreakdown: sortedTeams,
      };
    },
    enabled: !!gameLogs && !!nflGames && !!mlbGames,
  });
};
