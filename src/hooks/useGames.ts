
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
      
      // Parse the search filter to extract team abbreviation and league
      let searchTeam = '';
      let searchLeague = '';
      
      if (filters.search) {
        if (filters.search.includes(':')) {
          // New format: "ATL:NFL" or "ATL:MLB"
          const [team, league] = filters.search.split(':');
          searchTeam = team;
          searchLeague = league;
        } else {
          // Legacy format: just "ATL"
          searchTeam = filters.search;
        }
      }
      
      // Fetch NFL games if no league filter or NFL is selected
      if (!filters.league || filters.league === 'NFL') {
        let nflQuery = supabase.from('nfl_games').select('*').order('date', { ascending: false });
        
        if (searchTeam) {
          // Only filter NFL games if no league specified in search or NFL specified
          if (!searchLeague || searchLeague === 'NFL') {
            // NFL stores team abbreviations in lowercase
            const nflTeamCode = searchTeam.toLowerCase();
            nflQuery = nflQuery.or(`home_team.eq.${nflTeamCode},away_team.eq.${nflTeamCode}`);
          } else {
            // If search is for MLB team specifically, don't return NFL games
            nflQuery = nflQuery.limit(0);
          }
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
        
        if (searchTeam) {
          // Only filter MLB games if no league specified in search or MLB specified
          if (!searchLeague || searchLeague === 'MLB') {
            // MLB stores team abbreviations in uppercase
            const mlbTeamCode = searchTeam.toUpperCase();
            mlbQuery = mlbQuery.or(`home_team.eq.${mlbTeamCode},away_team.eq.${mlbTeamCode}`);
          } else {
            // If search is for NFL team specifically, don't return MLB games
            mlbQuery = mlbQuery.limit(0);
          }
        }
        
        if (filters.season) {
          // For MLB, filter by year from date since there's no season column
          const year = parseInt(filters.season);
          const startDate = `${year}-01-01`;
          const endDate = `${year}-12-31`;
          mlbQuery = mlbQuery.gte('date', startDate).lte('date', endDate);
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
