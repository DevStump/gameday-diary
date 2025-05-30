
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMLBTeamCodes = () => {
  return useQuery({
    queryKey: ['mlb-team-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mlb_teams')
        .select('team_name, team_code')
        .order('team_name');

      if (error) {
        console.error('Error fetching MLB team codes:', error);
        throw error;
      }

      // Create a mapping from team name to team code
      const teamCodeMap: Record<string, string> = {};
      data?.forEach((team) => {
        if (team.team_name && team.team_code) {
          teamCodeMap[team.team_name] = team.team_code;
        }
      });

      console.log('MLB team code mapping:', teamCodeMap);
      return teamCodeMap;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours since team codes don't change often
  });
};
