import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { normalizeTeamName } from '@/utils/team-name-map';

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
    // MLB database stores team names as full names, use the normalization map
    const normalizedAbbr = normalizeTeamName(teamAbbr, 'MLB');
    const mlbVariants: Record<string, string[]> = {
      'ARI': ['Arizona Diamondbacks'],
      'ATL': ['Atlanta Braves'],
      'BAL': ['Baltimore Orioles'],
      'BOS': ['Boston Red Sox'],
      'CHC': ['Chicago Cubs'],
      'CWS': ['Chicago White Sox'],
      'CIN': ['Cincinnati Reds'],
      'CLE': ['Cleveland Guardians', 'Cleveland Indians'], // Include historical name
      'COL': ['Colorado Rockies'],
      'DET': ['Detroit Tigers'],
      'HOU': ['Houston Astros'],
      'KC': ['Kansas City Royals'],
      'LAA': ['Los Angeles Angels', 'Anaheim Angels', 'California Angels', 'Los Angeles Angels of Anaheim'], // Include historical names
      'LAD': ['Los Angeles Dodgers'],
      'MIA': ['Miami Marlins', 'Florida Marlins'], // Include historical name
      'MIL': ['Milwaukee Brewers'],
      'MIN': ['Minnesota Twins'],
      'NYM': ['New York Mets'],
      'NYY': ['New York Yankees'],
      'OAK': ['Oakland Athletics'],
      'PHI': ['Philadelphia Phillies'],
      'PIT': ['Pittsburgh Pirates'],
      'SD': ['San Diego Padres'],
      'SF': ['San Francisco Giants'],
      'SEA': ['Seattle Mariners'],
      'STL': ['St. Louis Cardinals'],
      'TB': ['Tampa Bay Rays', 'Tampa Bay Devil Rays'], // Include historical name
      'TEX': ['Texas Rangers'],
      'TOR': ['Toronto Blue Jays'],
      'WSH': ['Washington Nationals', 'Montreal Expos'] // Include historical name
    };
    return mlbVariants[normalizedAbbr] || mlbVariants[upperTeam] || [upperTeam];
  }
};

// Function to generate consistent random diary entries based on game_id
const generateDiaryEntries = (gameId: string): number => {
  // Use game_id to seed randomization for consistency
  const seed = gameId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed * 9301 + 49297) % 233280 / 233280;
  return Math.floor(random * (10000 - 9 + 1)) + 9;
};

export const useGames = (filters: GameFilters) => {
  return useQuery({
    queryKey: ['games', filters],
    queryFn: async () => {
      console.log('Fetching games with filters:', filters);
      
      // Don't execute query if only one date is provided
      const hasOnlyStartDate = filters.startDate && !filters.endDate;
      const hasOnlyEndDate = !filters.startDate && filters.endDate;
      
      if (hasOnlyStartDate || hasOnlyEndDate) {
        console.log('Only one date provided, not executing query');
        return [];
      }
      
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
      
      // Get yesterday's date for filtering future games (includes today but excludes tomorrow)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      // Only apply date range filtering if both startDate and endDate are provided
      const shouldApplyDateRange = filters.startDate && filters.endDate;
      
      // Fetch NFL games if no league filter or NFL is selected
      if (!filters.league || filters.league === 'NFL') {
        let nflQuery = supabase.from('nfl_games').select('*').order('date', { ascending: false }).order('game_time', { ascending: false });
        
        // Filter out future games unless specific date filters are provided
        if (!shouldApplyDateRange) {
          nflQuery = nflQuery.lte('date', yesterdayString);
        }
        
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
        if (filters.playoff === 'true') {
          nflQuery = nflQuery.eq('playoff', true);
        } else if (filters.playoff === 'false') {
          nflQuery = nflQuery.eq('playoff', false);
        } else if (filters.playoff === 'exhibition') {
          // For NFL, exhibition games are typically week 0 or negative weeks (preseason)
          nflQuery = nflQuery.lte('week', 0);
        }
        if (shouldApplyDateRange) {
          nflQuery = nflQuery.gte('date', filters.startDate).lte('date', filters.endDate);
        }
        
        promises.push(nflQuery);
      }

      // Fetch MLB games if no league filter or MLB is selected
      if (!filters.league || filters.league === 'MLB') {
        let mlbQuery = supabase.from('mlb_schedule').select('*').order('game_date', { ascending: false }).order('game_datetime', { ascending: false });
        
        // Filter out future games unless specific date filters are provided
        if (!shouldApplyDateRange) {
          mlbQuery = mlbQuery.lte('game_date', yesterdayString);
        }
        
        if (searchTeam) {
          // Only filter MLB games if no league specified in search or MLB specified
          if (!searchLeague || searchLeague === 'MLB') {
            const teamVariants = getTeamVariants(searchTeam, 'MLB');
            console.log('MLB team variants for', searchTeam, ':', teamVariants);
            
            // Create OR conditions for all variants
            const orConditions = teamVariants.flatMap(variant => [
              `home_name.eq.${variant}`,
              `away_name.eq.${variant}`
            ]).join(',');
            
            mlbQuery = mlbQuery.or(orConditions);
          } else {
            // If search is for NFL team specifically, don't return MLB games
            mlbQuery = mlbQuery.limit(0);
          }
        }
        
        // Filter MLB games by year using the game_date field
        if (filters.season) {
          const seasonYear = parseInt(filters.season);
          const startOfYear = `${seasonYear}-01-01`;
          const endOfYear = `${seasonYear}-12-31`;
          mlbQuery = mlbQuery.gte('game_date', startOfYear).lte('game_date', endOfYear);
        }
        
        if (filters.playoff === 'true') {
          // Filter by game_type for playoffs
          mlbQuery = mlbQuery.in('game_type', ['W', 'D', 'L']); // Wild Card, Division, League Championship, World Series
        } else if (filters.playoff === 'false') {
          // Regular season games
          mlbQuery = mlbQuery.eq('game_type', 'R');
        } else if (filters.playoff === 'exhibition') {
          // Exhibition games - Spring Training, Exhibition, etc.
          mlbQuery = mlbQuery.in('game_type', ['S', 'E']); // Spring Training, Exhibition
        }
        if (shouldApplyDateRange) {
          mlbQuery = mlbQuery.gte('game_date', filters.startDate).lte('game_date', filters.endDate);
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
            is_future: !game.pts_off && !game.pts_def,
            diaryEntries: generateDiaryEntries(game.game_id),
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
            // Map new field names to old structure for compatibility
            date: game.game_date,
            home_team: game.home_name,
            away_team: game.away_name,
            runs_scored: game.home_score,
            runs_allowed: game.away_score,
            playoff: ['W', 'D', 'L'].includes(game.game_type),
            venue: game.venue_name || 'Stadium',
            is_future: !game.home_score && !game.away_score && game.status !== 'Final',
            diaryEntries: generateDiaryEntries(game.game_id.toString()),
          })));
        }
      }

      console.log('Total games:', allGames.length);
      
      // Sort by date and time (newest first - descending), then by venue (ascending)
      const sortedGames = allGames.sort((a, b) => {
        const dateA = a.date || a.game_date;
        const dateB = b.date || b.game_date;
        
        // First sort by date
        const dateComparison = dateB.localeCompare(dateA);
        if (dateComparison !== 0) {
          return dateComparison;
        }
        
        // If dates are the same, sort by time
        const timeA = a.game_datetime || a.game_time || '';
        const timeB = b.game_datetime || b.game_time || '';
        
        // For datetime fields, compare directly
        if (timeA && timeB) {
          const timeComparison = timeB.localeCompare(timeA);
          if (timeComparison !== 0) {
            return timeComparison;
          }
        }
        
        // If date and time are the same, sort by venue (ascending)
        const venueA = a.venue || a.venue_name || '';
        const venueB = b.venue || b.venue_name || '';
        return venueA.localeCompare(venueB);
      });
      
      console.log('Final games count:', sortedGames.length);
      
      return sortedGames;
    },
  });
};
