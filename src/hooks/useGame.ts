
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useGame = (gameId: string, league: 'NFL' | 'MLB') => {
  return useQuery({
    queryKey: ['game', gameId, league],
    queryFn: async () => {
      console.log('Fetching game:', gameId, 'from league:', league);
      
      const tableName = league === 'NFL' ? 'nfl_games' : 'mlb_schedule';
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('game_id', gameId)
        .single();

      if (error) {
        console.error('Error fetching game:', error);
        throw error;
      }

      if (league === 'MLB') {
        // Map new field names to old structure for compatibility
        return {
          ...data,
          league,
          date: data.game_date,
          home_team: data.home_name,
          away_team: data.away_name,
          runs_scored: data.home_score,
          runs_allowed: data.away_score,
          playoff: ['W', 'D', 'L'].includes(data.game_type),
          venue: data.venue_name || 'Stadium',
          winning_pitcher: data.winning_pitcher,
          losing_pitcher: data.losing_pitcher,
          saving_pitcher: data.save_pitcher,
        };
      }

      return {
        ...data,
        league,
        venue: 'Stadium',
      };
    },
    enabled: !!gameId && !!league,
  });
};
