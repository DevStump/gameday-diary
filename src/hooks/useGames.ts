
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
  excludeFutureGames?: boolean; // New parameter to control future game filtering
}

// Helper function to get all possible team abbreviation variants
const getTeamVariants = (teamAbbr: string): string[] => {
  const upperTeam = teamAbbr.toUpperCase();
  
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
};

// Function to generate consistent random diary entries based on game_id
const generateDiaryEntries = (gameId: string): number => {
  const seed = gameId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed * 9301 + 49297) % 233280 / 233280;
  return Math.floor(random * (10000 - 9 + 1)) + 9;
};

export const useGames = (filters: GameFilters) => {
  return useQuery({
    queryKey: ['games', filters],
    queryFn: async () => {
      console.log('Fetching games with filters:', filters);
      
      // Check if we have a complete date range (both start and end dates)
      const hasCompleteDateRange = filters.startDate && filters.endDate;
      
      // Don't execute query if only one date is provided
      const hasOnlyStartDate = filters.startDate && !filters.endDate;
      const hasOnlyEndDate = !filters.startDate && filters.endDate;
      
      if (hasOnlyStartDate || hasOnlyEndDate) {
        console.log('Only one date provided, not executing query');
        return [];
      }
      
      // Parse the search filter to extract team abbreviation
      let searchTeam = '';
      
      if (filters.search) {
        if (filters.search.includes(':')) {
          // New format: "ATL:MLB"
          const [team] = filters.search.split(':');
          searchTeam = team;
        } else {
          // Legacy format: just "ATL"
          searchTeam = filters.search;
        }
      }
      
      // Get yesterday's date for filtering future games (only used when excludeFutureGames is true)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      // Fetch MLB games only
      let mlbQuery = supabase.from('mlb_schedule').select('*').order('game_date', { ascending: false }).order('game_datetime', { ascending: false });
      
      // Apply date filtering
      if (hasCompleteDateRange) {
        // Use the specified date range
        mlbQuery = mlbQuery.gte('game_date', filters.startDate).lte('game_date', filters.endDate);
        console.log('Applying MLB date range filter:', filters.startDate, 'to', filters.endDate);
      } else if (filters.excludeFutureGames !== false) {
        // Only filter out future games if excludeFutureGames is not explicitly false
        mlbQuery = mlbQuery.lte('game_date', yesterdayString);
        console.log('Applying MLB default date filter (up to yesterday):', yesterdayString);
      } else {
        console.log('Not applying future game filter - showing all games including future ones');
      }
      
      if (searchTeam) {
        const teamVariants = getTeamVariants(searchTeam);
        console.log('MLB team variants for', searchTeam, ':', teamVariants);
        
        // Create OR conditions for all variants
        const orConditions = teamVariants.flatMap(variant => [
          `home_name.eq.${variant}`,
          `away_name.eq.${variant}`
        ]).join(',');
        
        mlbQuery = mlbQuery.or(orConditions);
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

      const result = await mlbQuery;
      console.log('Query result:', result);
      
      if (result?.error) {
        console.error('MLB games error:', result.error);
        throw result.error;
      }

      const mlbGames = result?.data || [];
      console.log('MLB games count:', mlbGames.length);
      
      const allGames = mlbGames.map((game: any) => ({
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
      }));

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
