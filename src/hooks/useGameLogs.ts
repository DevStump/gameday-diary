
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Input validation helpers
const validateGameLogInput = (gameLog: {
  game_id: string;
  mode: 'attended' | 'watched';
  company?: string;
  rating?: number;
  rooted_for?: string;
  notes?: string;
}) => {
  // Validate required fields
  if (!gameLog.game_id || !gameLog.mode) {
    throw new Error('Game ID and mode are required');
  }

  // Validate mode
  if (!['attended', 'watched'].includes(gameLog.mode)) {
    throw new Error('Invalid mode. Must be "attended" or "watched"');
  }

  // Validate rating if provided
  if (gameLog.rating !== undefined && gameLog.rating !== null) {
    if (!Number.isInteger(gameLog.rating) || gameLog.rating < 1 || gameLog.rating > 5) {
      throw new Error('Rating must be an integer between 1 and 5');
    }
  }

  // Sanitize text inputs
  const sanitizedGameLog = {
    ...gameLog,
    company: gameLog.company?.trim().slice(0, 255) || null,
    notes: gameLog.notes?.trim().slice(0, 1000) || null,
    rooted_for: gameLog.rooted_for?.trim().slice(0, 100) || null,
  };

  return sanitizedGameLog;
};

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
      if (!user) throw new Error('Must be authenticated to add game logs');

      // Validate and sanitize input
      const validatedGameLog = validateGameLogInput(gameLog);

      const { data, error } = await supabase
        .from('user_game_logs')
        .insert({
          ...validatedGameLog,
          user_id: user.id, // Explicitly set user_id for security
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
      if (!user) throw new Error('Must be authenticated to update game logs');

      if (!gameLog.id) {
        throw new Error('Game log ID is required for updates');
      }

      // Validate and sanitize input (excluding id and game_id for updates)
      const validatedGameLog = validateGameLogInput({
        ...gameLog,
        game_id: 'temp', // Required for validation but not used in update
      });

      const { data, error } = await supabase
        .from('user_game_logs')
        .update({
          mode: validatedGameLog.mode,
          company: validatedGameLog.company,
          rating: validatedGameLog.rating,
          rooted_for: validatedGameLog.rooted_for,
          notes: validatedGameLog.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', gameLog.id)
        .eq('user_id', user.id) // Double-check user ownership
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
      if (!user) throw new Error('Must be authenticated to delete game logs');

      if (!gameLogId) {
        throw new Error('Game log ID is required for deletion');
      }

      const { error } = await supabase
        .from('user_game_logs')
        .delete()
        .eq('id', gameLogId)
        .eq('user_id', user.id); // Double-check user ownership

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-logs'] });
    },
  });
};
