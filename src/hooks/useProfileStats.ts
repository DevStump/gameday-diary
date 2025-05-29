
import { useQuery } from '@tanstack/react-query';
import { useGameLogs } from './useGameLogs';
import { useGames } from './useGames';

export const useProfileStats = () => {
  const { data: gameLogs } = useGameLogs();
  const { data: nflGames } = useGames('nfl');
  const { data: mlbGames } = useGames('mlb');

  return useQuery({
    queryKey: ['profile-stats', gameLogs],
    queryFn: () => {
      if (!gameLogs || !nflGames || !mlbGames) return null;

      const allGames = [...(nflGames || []), ...(mlbGames || [])];
      
      // Basic counts
      const totalGames = gameLogs.length;
      const gamesAttended = gameLogs.filter(log => log.mode === 'attended').length;
      const gamesWatched = gameLogs.filter(log => log.mode === 'watched').length;
      
      // Average rating
      const ratedGames = gameLogs.filter(log => log.rating && log.rating > 0);
      const avgRating = ratedGames.length > 0 
        ? ratedGames.reduce((sum, log) => sum + log.rating, 0) / ratedGames.length 
        : 0;

      // Win/Loss record based on rooted team
      let wins = 0;
      let losses = 0;
      
      gameLogs.forEach(log => {
        if (log.rooted_for && log.rooted_for !== 'none') {
          const game = allGames.find(g => g.game_id === log.game_id);
          if (game && game.result) {
            const [awayScore, homeScore] = game.result.split('-').map(Number);
            const rootedTeamWon = 
              (log.rooted_for === game.home_team && homeScore > awayScore) ||
              (log.rooted_for === game.away_team && awayScore > homeScore);
            
            if (rootedTeamWon) {
              wins++;
            } else {
              losses++;
            }
          }
        }
      });

      // Total points/runs witnessed
      let totalPoints = 0;
      gameLogs.forEach(log => {
        const game = allGames.find(g => g.game_id === log.game_id);
        if (game && game.result) {
          const [awayScore, homeScore] = game.result.split('-').map(Number);
          totalPoints += awayScore + homeScore;
        }
      });

      // League breakdown
      const nflLogs = gameLogs.filter(log => 
        allGames.find(g => g.game_id === log.game_id && nflGames?.includes(g))
      );
      const mlbLogs = gameLogs.filter(log => 
        allGames.find(g => g.game_id === log.game_id && mlbGames?.includes(g))
      );

      // Playoff games
      const playoffGames = gameLogs.filter(log => {
        const game = allGames.find(g => g.game_id === log.game_id);
        return game?.playoff;
      }).length;

      return {
        totalGames,
        gamesWatched,
        gamesAttended,
        avgRating: Math.round(avgRating * 10) / 10,
        totalPoints,
        winRecord: { wins, losses },
        nflGames: nflLogs.length,
        mlbGames: mlbLogs.length,
        playoffGames,
        highestRatedGame: Math.max(...ratedGames.map(log => log.rating), 0),
      };
    },
    enabled: !!gameLogs && !!nflGames && !!mlbGames,
  });
};
