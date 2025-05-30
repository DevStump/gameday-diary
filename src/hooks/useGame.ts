
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
          date: data.game_date || data.date,
          home_team: data.home_name || data.home_team,
          away_team: data.away_name || data.away_team,
          runs_scored: data.home_score || null,
          runs_allowed: data.away_score || null,
          playoff: data.game_type ? ['W', 'D', 'L'].includes(data.game_type) : false,
          venue: data.venue_name || 'Stadium',
          winning_pitcher: data.winning_pitcher || null,
          losing_pitcher: data.losing_pitcher || null,
          save_pitcher: data.save_pitcher || null,
          // Check if game is in the future (no final score and status not final)
          is_future: !data.home_score && !data.away_score && data.status !== 'Final',
        };
      }

      // NFL data structure
      return {
        ...data,
        league,
        venue: 'Stadium',
        // Check if game is in the future (no final score)
        is_future: !data.pts_off && !data.pts_def,
      };
    },
    enabled: !!gameId && !!league,
  });
};
