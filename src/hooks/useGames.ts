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

// Helper function to get all possible team abbreviation variants
const getTeamVariants = (teamAbbr: string, league: string): string[] => {
  const upperTeam = teamAbbr.toUpperCase();
  const lowerTeam = teamAbbr.toLowerCase();
  
  if (league === 'NFL') {
    // NFL database stores lowercase, but handle all possible variants
    const nflVariants: Record<string, string[]> = {
      'ARI': ['ari', 'crd'],
      'ATL': ['atl'],
      'BAL': ['bal', 'rav'],
      'BUF': ['buf'],
      'CAR': ['car'],
      'CHI': ['chi'],
      'CIN': ['cin'],
      'CLE': ['cle'],
      'DAL': ['dal'],
      'DEN': ['den'],
      'DET': ['det'],
      'GB': ['gnb', 'gb'],
      'HOU': ['hou', 'htx'],
      'IND': ['ind', 'clt'],
      'JAX': ['jax', 'jac'],
      'KC': ['kan', 'kc'],
      'LV': ['rai', 'lv', 'oak'],
      'LAC': ['lac', 'sdg', 'sd'],
      'LAR': ['lar', 'ram', 'stl'],
      'MIA': ['mia'],
      'MIN': ['min'],
      'NE': ['nwe', 'ne'],
      'NO': ['nor', 'no'],
      'NYG': ['nyg'],
      'NYJ': ['nyj'],
      'PHI': ['phi'],
      'PIT': ['pit'],
      'SF': ['sfo', 'sf'],
      'SEA': ['sea'],
      'TB': ['tam', 'tb'],
      'TEN': ['ten', 'oti'],
      'WAS': ['was', 'wsh']
    };
    return nflVariants[upperTeam] || [lowerTeam];
  } else {
    // MLB database stores uppercase, but handle variants
    const mlbVariants: Record<string, string[]> = {
      'ARI': ['ARI'],
      'ATL': ['ATL'],
      'BAL': ['BAL'],
      'BOS': ['BOS'],
      'CHC': ['CHC'],
      'CWS': ['CWS', 'CHW'],
      'CIN': ['CIN'],
      'CLE': ['CLE'],
      'COL': ['COL'],
      'DET': ['DET'],
      'HOU': ['HOU'],
      'KC': ['KC', 'KCR'],
      'LAA': ['LAA'],
      'LAD': ['LAD'],
      'MIA': ['MIA'],
      'MIL': ['MIL'],
      'MIN': ['MIN'],
      'NYM': ['NYM'],
      'NYY': ['NYY'],
      'OAK': ['OAK', 'ATH'],
      'PHI': ['PHI'],
      'PIT': ['PIT'],
      'SD': ['SD', 'SDP'],
      'SF': ['SF', 'SFG'],
      'SEA': ['SEA'],
      'STL': ['STL'],
      'TB': ['TB', 'TBR'],
      'TEX': ['TEX'],
      'TOR': ['TOR'],
      'WSH': ['WSH', 'WSN']
    };
    return mlbVariants[upperTeam] || [upperTeam];
  }
};

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
            const teamVariants = getTeamVariants(searchTeam, 'NFL');
            console.log('NFL team variants for', searchTeam, ':', teamVariants);
            
            // Create OR conditions for all variants
            const orConditions = teamVariants.flatMap(variant => [
              `home_team.eq.${variant}`,
              `away_team.eq.${variant}`
            ]).join(',');
            
            nflQuery = nflQuery.or(orConditions);
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
            const teamVariants = getTeamVariants(searchTeam, 'MLB');
            console.log('MLB team variants for', searchTeam, ':', teamVariants);
            
            // Create OR conditions for all variants
            const orConditions = teamVariants.flatMap(variant => [
              `home_team.eq.${variant}`,
              `away_team.eq.${variant}`
            ]).join(',');
            
            mlbQuery = mlbQuery.or(orConditions);
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
