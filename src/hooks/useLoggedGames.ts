
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { normalizeTeamName } from '@/utils/team-name-map';

// Function to generate consistent random diary entries based on game_id
const generateDiaryEntries = (gameId: string): number => {
  const seed = gameId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed * 9301 + 49297) % 233280 / 233280;
  return Math.floor(random * (10000 - 9 + 1)) + 9;
};

export const useLoggedGames = (filters: {
  mode: string;
}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['logged-games', user?.id, filters],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching logged games for user:', user.id);
      
      // First, fetch all user game logs
      const { data: gameLogs, error: logsError } = await supabase
        .from('user_game_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (logsError) {
        console.error('Error fetching game logs:', logsError);
        throw logsError;
      }

      if (!gameLogs || gameLogs.length === 0) {
        console.log('No game logs found');
        return [];
      }

      console.log('Found game logs:', gameLogs.length);

      // Extract unique game IDs from logs
      const gameIds = [...new Set(gameLogs.map(log => parseInt(log.game_id)))];
      console.log('Fetching games for IDs:', gameIds);

      // Fetch only the games that have logs
      const { data: mlbGames, error: gamesError } = await supabase
        .from('mlb_schedule')
        .select('*')
        .in('game_id', gameIds);

      if (gamesError) {
        console.error('Error fetching MLB games:', gamesError);
        throw gamesError;
      }

      console.log('Found MLB games:', mlbGames?.length || 0);

      // Create enriched games with log data
      const enrichedGames = gameLogs.map(log => {
        console.log('Looking for game with ID:', log.game_id);
        
        // Find the corresponding MLB game
        const game = mlbGames?.find(g => g.game_id?.toString() === log.game_id?.toString());
        
        if (!game) {
          console.log('No game found for log:', log);
          return null;
        }

        console.log('Found game:', game);

        // Return enriched game object with log data
        return {
          ...game,
          // Ensure proper field mapping for MLB games
          game_id: game.game_id?.toString() || log.game_id,
          date: game.game_date,
          home_team: game.home_name,
          away_team: game.away_name,
          runs_scored: game.home_score,
          runs_allowed: game.away_score,
          venue: game.venue_name,
          league: 'MLB' as const,
          playoff: ['W', 'D', 'L'].includes(game.game_type),
          diaryEntries: generateDiaryEntries(game.game_id.toString()),
          // Add log metadata
          logData: {
            id: log.id,
            mode: log.mode,
            company: log.company,
            rating: log.rating,
            rooted_for: log.rooted_for,
            notes: log.notes,
            created_at: log.created_at,
            updated_at: log.updated_at
          }
        };
      }).filter(Boolean);

      // Apply mode filter if specified
      let filteredGames = enrichedGames;
      if (filters.mode) {
        filteredGames = enrichedGames.filter(game => game.logData.mode === filters.mode);
      }

      // Sort by game datetime descending (newest first), then by venue
      const sortedGames = filteredGames.sort((a, b) => {
        const dateA = a.date || a.game_date;
        const dateB = b.date || b.game_date;
        
        // First sort by date
        const dateComparison = dateB.localeCompare(dateA);
        if (dateComparison !== 0) {
          return dateComparison;
        }
        
        // If dates are the same, sort by time
        const timeA = a.game_datetime || '';
        const timeB = b.game_datetime || '';
        
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

      console.log('Final enriched logged games:', sortedGames.length);
      
      return sortedGames;
    },
    enabled: !!user,
  });
};
