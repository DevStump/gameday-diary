
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
      // Fetch NFL games
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

      // Fetch MLB games
      let mlbQuery = supabase.from('mlb_games').select('*');
      
      if (filters.search) {
        mlbQuery = mlbQuery.or(`home_team.ilike.%${filters.search}%,away_team.ilike.%${filters.search}%`);
      }
      if (filters.playoff) {
        mlbQuery = mlbQuery.eq('playoff', filters.playoff === 'true');
      }

      const promises = [];
      
      if (!filters.league || filters.league === 'NFL') {
        promises.push(nflQuery);
      }
      if (!filters.league || filters.league === 'MLB') {
        promises.push(mlbQuery);
      }

      const results = await Promise.all(promises);
      
      let allGames: any[] = [];
      
      if (!filters.league || filters.league === 'NFL') {
        const nflGames = results[0]?.data || [];
        allGames = allGames.concat(nflGames.map((game: any) => ({
          ...game,
          league: 'NFL' as const,
          venue: 'Stadium', // You can enhance this with actual venue data
        })));
      }
      
      if (!filters.league || filters.league === 'MLB') {
        const mlbIndex = filters.league === 'NFL' ? 1 : 0;
        const mlbGames = results[mlbIndex]?.data || [];
        allGames = allGames.concat(mlbGames.map((game: any) => ({
          ...game,
          league: 'MLB' as const,
          venue: 'Stadium', // You can enhance this with actual venue data
        })));
      }

      // Sort by date (newest first)
      return allGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
  });
};
