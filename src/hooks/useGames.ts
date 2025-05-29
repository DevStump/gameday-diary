
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GameFilters {
  search: string;
  league: string;
  season: string;
  playoff: string;
}

export const useGames = (filters: GameFilters) => {
  return useQuery({
    queryKey: ['games', filters],
    queryFn: async () => {
      console.log('Fetching games with filters:', filters);
      
      const promises = [];
      
      // Fetch NFL games if no league filter or NFL is selected
      if (!filters.league || filters.league === 'NFL') {
        let nflQuery = supabase.from('nfl_games').select('*');
        
        if (filters.search) {
          nflQuery = nflQuery.or(`home_team.ilike.%${filters.search}%,away_team.ilike.%${filters.search}%`);
        }
        if (filters.season) {
          nflQuery = nflQuery.eq('season', parseInt(filters.season));
        }
        if (filters.playoff) {
          nflQuery = nflQuery.eq('playoff', filters.playoff === 'true');
        }
        
        promises.push(nflQuery);
      }

      // Fetch MLB games if no league filter or MLB is selected
      if (!filters.league || filters.league === 'MLB') {
        let mlbQuery = supabase.from('mlb_games').select('*');
        
        if (filters.search) {
          mlbQuery = mlbQuery.or(`home_team.ilike.%${filters.search}%,away_team.ilike.%${filters.search}%`);
        }
        if (filters.playoff) {
          mlbQuery = mlbQuery.eq('playoff', filters.playoff === 'true');
        }
        
        promises.push(mlbQuery);
      }

      if (promises.length === 0) {
        console.log('No queries to execute');
        return [];
      }

      const results = await Promise.all(promises);
      console.log('Query results:', results);
      
      let allGames: any[] = [];
      
      // Process NFL games
      if (!filters.league || filters.league === 'NFL') {
        const nflIndex = 0;
        const nflResult = results[nflIndex];
        
        if (nflResult?.error) {
          console.error('NFL games error:', nflResult.error);
        } else {
          const nflGames = nflResult?.data || [];
          console.log('NFL games count:', nflGames.length);
          allGames = allGames.concat(nflGames.map((game: any) => ({
            ...game,
            league: 'NFL' as const,
            venue: 'Stadium',
          })));
        }
      }
      
      // Process MLB games
      if (!filters.league || filters.league === 'MLB') {
        const mlbIndex = (!filters.league || filters.league === 'NFL') ? 1 : 0;
        const mlbResult = results[mlbIndex];
        
        if (mlbResult?.error) {
          console.error('MLB games error:', mlbResult.error);
        } else {
          const mlbGames = mlbResult?.data || [];
          console.log('MLB games count:', mlbGames.length);
          allGames = allGames.concat(mlbGames.map((game: any) => ({
            ...game,
            league: 'MLB' as const,
            venue: 'Stadium',
          })));
        }
      }

      console.log('Total games before sorting:', allGames.length);
      
      // Debug: Log some sample dates to check format
      if (allGames.length > 0) {
        console.log('Sample game dates (first 5):');
        allGames.slice(0, 5).forEach((game, index) => {
          console.log(`Game ${index + 1}: ${game.date} (${new Date(game.date).toISOString()})`);
        });
        
        // Check for May 27, 2025 specifically
        const may27Games = allGames.filter(game => {
          const gameDate = new Date(game.date);
          return gameDate.getMonth() === 4 && gameDate.getDate() === 27 && gameDate.getFullYear() === 2025;
        });
        console.log('May 27, 2025 games found:', may27Games.length);
        if (may27Games.length > 0) {
          console.log('May 27 games:', may27Games.slice(0, 3));
        }
      }
      
      // Sort by date (newest first - descending)
      const sortedGames = allGames.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      
      console.log('Final games count:', sortedGames.length);
      console.log('Date range after sorting:');
      if (sortedGames.length > 0) {
        console.log('Latest game:', sortedGames[0].date, sortedGames[0].home_team, 'vs', sortedGames[0].away_team);
        console.log('Earliest game:', sortedGames[sortedGames.length - 1].date, sortedGames[sortedGames.length - 1].home_team, 'vs', sortedGames[sortedGames.length - 1].away_team);
      }
      
      return sortedGames;
    },
  });
};
