
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Baseball Reference specific team code mappings for historical accuracy
const baseballReferenceOverrides: Record<string, string> = {
  'FLA': 'FLO', // Florida Marlins used FLO on Baseball Reference
  'ANA': 'ANA', // Anaheim Angels
  'CAL': 'CAL', // California Angels
  'MON': 'MON', // Montreal Expos
  // Current teams that use different codes on Baseball Reference
  'LAD': 'LAN', // Los Angeles Dodgers
  'STL': 'SLN', // St. Louis Cardinals
  'CHC': 'CHN', // Chicago Cubs
  'NYM': 'NYN', // New York Mets
  'SF': 'SFN', // San Francisco Giants
  'SD': 'SDN', // San Diego Padres
  'CWS': 'CHA', // Chicago White Sox
  'NYY': 'NYA', // New York Yankees
  'TB': 'TBA', // Tampa Bay Rays
  'KC': 'KCA', // Kansas City Royals
};

export const useMLBTeamCodes = () => {
  return useQuery({
    queryKey: ['mlb-team-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mlb_teams')
        .select('team_name, team_code, file_code')
        .order('team_name');

      if (error) {
        console.error('Error fetching MLB team codes:', error);
        throw error;
      }

      // Create a mapping from file_code to team_code (what Baseball Reference uses)
      // Ensure keys are uppercase for consistent lookup
      const teamCodeMap: Record<string, string> = {};
      data?.forEach((team) => {
        if (team.file_code && team.team_code) {
          let bbrefCode = team.team_code;
          
          // Apply Baseball Reference specific overrides
          if (baseballReferenceOverrides[team.file_code.toUpperCase()]) {
            bbrefCode = baseballReferenceOverrides[team.file_code.toUpperCase()];
          }
          
          teamCodeMap[team.file_code.toUpperCase()] = bbrefCode;
        }
      });

      console.log('MLB team code mapping (file_code -> bbref_code):', teamCodeMap);
      return teamCodeMap;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours since team codes don't change often
  });
};
