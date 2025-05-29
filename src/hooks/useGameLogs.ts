
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useGameLogs = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['game-logs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_game_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useAddGameLog = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (gameLog: {
      game_id: string;
      mode: 'attended' | 'watched';
      company?: string;
      rating?: number;
      rooted_for?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error('Must be authenticated');

      const { data, error } = await supabase
        .from('user_game_logs')
        .insert({
          ...gameLog,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-logs'] });
    },
  });
};

export const useUpdateGameLog = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (gameLog: {
      id: string;
      mode: 'attended' | 'watched';
      company?: string;
      rating?: number;
      rooted_for?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error('Must be authenticated');

      const { data, error } = await supabase
        .from('user_game_logs')
        .update({
          mode: gameLog.mode,
          company: gameLog.company,
          rating: gameLog.rating,
          rooted_for: gameLog.rooted_for,
          notes: gameLog.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', gameLog.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-logs'] });
    },
  });
};

export const useDeleteGameLog = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (gameLogId: string) => {
      if (!user) throw new Error('Must be authenticated');

      const { error } = await supabase
        .from('user_game_logs')
        .delete()
        .eq('id', gameLogId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-logs'] });
    },
  });
};
