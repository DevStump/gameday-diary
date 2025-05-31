
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
            const isNflGame = nflGames?.some(nflGame => nflGame.game_id === game.game_id);
            
            if (isNflGame) {
              // NFL: pts_off is home team score, pts_def is away team score
              if (game.pts_off !== undefined && game.pts_def !== undefined) {
                const isHome = log.rooted_for === game.home_team;
                teamScore = isHome ? game.pts_off : game.pts_def;
                oppScore = isHome ? game.pts_def : game.pts_off;
              }
            } else {
              // MLB: home_score/runs_scored is home team, away_score/runs_allowed is away team
              const homeScore = game.home_score || game.runs_scored;
              const awayScore = game.away_score || game.runs_allowed;
              
              if (homeScore !== undefined && awayScore !== undefined) {
                const isHome = log.rooted_for === game.home_team || log.rooted_for === game.home_name;
                teamScore = isHome ? homeScore : awayScore;
                oppScore = isHome ? awayScore : homeScore;
              }
            }
            
            if (teamScore !== undefined && oppScore !== undefined) {
              if (teamScore > oppScore) {
                wins++;
              } else if (teamScore < oppScore) {
                losses++;
              }
              // Note: ties are not counted in either wins or losses
            }
          }
        }
      });

      // League breakdown
      const nflLogs = gameLogs.filter(log => 
        nflGames?.some(nflGame => nflGame.game_id === log.game_id)
      );
      const mlbLogs = gameLogs.filter(log => 
        mlbGames?.some(mlbGame => mlbGame.game_id === log.game_id)
      );

      // Team breakdown - count games by team
      const teamCounts: Record<string, number> = {};
      gameLogs.forEach(log => {
        const game = allGames.find(g => g.game_id === log.game_id);
        if (game) {
          // Count both home and away teams
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

      // Sort teams by count and get top teams
      const sortedTeams = Object.entries(teamCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5); // Top 5 teams

      // Playoff games
      const playoffGames = gameLogs.filter(log => {
        const game = allGames.find(g => g.game_id === log.game_id);
        if (!game) return false;
        
        // Check playoff status based on league
        if (nflGames?.some(nflGame => nflGame.game_id === game.game_id)) {
          return game.playoff === true;
        } else {
          // MLB: playoff games have game_type of 'W', 'D', or 'L'
          return ['W', 'D', 'L'].includes(game.game_type);
        }
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
