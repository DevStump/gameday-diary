
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useGame = (gameId: string, league: 'MLB' | 'NFL') => {
  return useQuery({
    queryKey: ['game', gameId, league],
    queryFn: async () => {
      console.log('Fetching game:', gameId, 'from league:', league);
      
      if (league === 'MLB') {
        const { data, error } = await supabase
          .from('mlb_schedule')
          .select('*')
          .eq('game_id', parseInt(gameId))
          .single();

        if (error) {
          console.error('Error fetching MLB game:', error);
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
          // Check if game is in the future (no final score and status not final)
          is_future: !mlbData.home_score && !mlbData.away_score && mlbData.status !== 'Final',
        };
      } else {
        // NFL logic would go here if needed
        throw new Error('NFL games not yet supported');
      }
    },
    enabled: !!gameId && !!league,
  });
};
