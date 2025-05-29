
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useGame = (gameId: string, league: 'NFL' | 'MLB') => {
  return useQuery({
    queryKey: ['game', gameId, league],
    queryFn: async () => {
      console.log('Fetching game:', gameId, 'from league:', league);
      
      const tableName = league === 'NFL' ? 'nfl_games' : 'mlb_games';
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('game_id', gameId)
        .single();

      if (error) {
        console.error('Error fetching game:', error);
        throw error;
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
