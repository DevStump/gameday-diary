
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useGame = (gameId: string, league: 'MLB') => {
  return useQuery({
    queryKey: ['game', gameId, league],
    queryFn: async () => {
      console.log('Fetching game:', gameId, 'from league:', league);
      
      const { data, error } = await supabase
        .from('mlb_schedule')
        .select('*')
        .eq('game_id', gameId)
        .single();

      if (error) {
        console.error('Error fetching game:', error);
        throw error;
      }

      // Handle MLB data structure with safe property access
      const mlbData = data as any;
      return {
        ...mlbData,
        league,
        date: mlbData.game_date || mlbData.date || null,
        home_team: mlbData.home_name || mlbData.home_team || null,
        away_team: mlbData.away_name || mlbData.away_team || null,
        runs_scored: mlbData.home_score || null,
        runs_allowed: mlbData.away_score || null,
        playoff: mlbData.game_type ? ['W', 'D', 'L'].includes(mlbData.game_type) : false,
        venue: mlbData.venue_name || 'Stadium',
        winning_pitcher: mlbData.winning_pitcher || null,
        losing_pitcher: mlbData.losing_pitcher || null,
        save_pitcher: mlbData.save_pitcher || null,
        // Check if game is in the future (no final score and status not final)
        is_future: !mlbData.home_score && !mlbData.away_score && mlbData.status !== 'Final',
      };
    },
    enabled: !!gameId && !!league,
  });
};
