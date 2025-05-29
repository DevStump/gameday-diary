
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GameFilters {
  search: string;
  league: string;
  season: string;
  playoff: string;
  startDate: string;
  endDate: string;
}

export const useGames = (filters: GameFilters) => {
  return useQuery({
    queryKey: ['games', filters],
    queryFn: async () => {
      console.log('Fetching games with filters:', filters);
      
      const promises = [];
      
      // Fetch NFL games if no league filter or NFL is selected
      if (!filters.league || filters.league === 'NFL') {
        let nflQuery = supabase.from('nfl_games').select('*').order('date', { ascending: false });
        
        if (filters.search) {
          nflQuery = nflQuery.or(`home_team.ilike.%${filters.search}%,away_team.ilike.%${filters.search}%`);
        }
        if (filters.season) {
          nflQuery = nflQuery.eq('season', parseInt(filters.season));
        }
        if (filters.playoff) {
          nflQuery = nflQuery.eq('playoff', filters.playoff === 'true');
        }
        if (filters.startDate) {
          nflQuery = nflQuery.gte('date', filters.startDate);
        }
        if (filters.endDate) {
          nflQuery = nflQuery.lte('date', filters.endDate);
        }
        
        promises.push(nflQuery);
      }

      // Fetch MLB games if no league filter or MLB is selected
      if (!filters.league || filters.league === 'MLB') {
        let mlbQuery = supabase.from('mlb_games').select('*').order('date', { ascending: false });
        
        if (filters.search) {
          mlbQuery = mlbQuery.or(`home_team.ilike.%${filters.search}%,away_team.ilike.%${filters.search}%`);
        }
        if (filters.playoff) {
          mlbQuery = mlbQuery.eq('playoff', filters.playoff === 'true');
        }
        if (filters.startDate) {
          mlbQuery = mlbQuery.gte('date', filters.startDate);
        }
        if (filters.endDate) {
          mlbQuery = mlbQuery.lte('date', filters.endDate);
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
      
      // Sort by date (newest first - descending) using string comparison since dates are in YYYY-MM-DD format
      const sortedGames = allGames.sort((a, b) => {
        return b.date.localeCompare(a.date);
      });
      
      console.log('Final games count:', sortedGames.length);
      
      return sortedGames;
    },
  });
};
